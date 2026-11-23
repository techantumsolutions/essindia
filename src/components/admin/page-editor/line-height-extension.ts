import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

const LINE_HEIGHT_TYPES = ['paragraph', 'heading', 'listItem'] as const;

function applyLineHeight(tr: { setNodeMarkup: Function }, doc: { descendants: Function }, lineHeight: string | null) {
  const types = new Set<string>(LINE_HEIGHT_TYPES);
  doc.descendants((node: { type: { name: string }; attrs: Record<string, unknown> }, pos: number) => {
    if (!types.has(node.type.name)) return;
    if (node.attrs.lineHeight === lineHeight) return;
    tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      lineHeight,
    });
  });
}

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addGlobalAttributes() {
    return [
      {
        types: [...LINE_HEIGHT_TYPES],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const fromVar = element.style.getPropertyValue('--cms-line-height')?.trim();
              const fromStyle = element.style.lineHeight?.trim();
              return fromVar || fromStyle || null;
            },
            renderHTML: (attributes: { lineHeight?: string | null }) => {
              if (!attributes.lineHeight) return {};
              return {
                style: `line-height: ${attributes.lineHeight}; --cms-line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ tr, state, dispatch }) => {
          applyLineHeight(tr, state.doc, lineHeight);
          if (dispatch) dispatch(tr);
          return true;
        },
      unsetLineHeight:
        () =>
        ({ tr, state, dispatch }) => {
          applyLineHeight(tr, state.doc, null);
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
