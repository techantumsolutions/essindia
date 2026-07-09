export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'color'
  | 'image'
  | 'url'
  | 'icon'
  | 'object'
  | 'array'
  | 'countryCode'
  | 'topicSelect'
  | 'industrySelect'
  | 'formSelect'
  | 'null';

export function humanLabel(key: string): string {
  if (key === 'overviewTitle') return 'Title';
  if (key === 'overviewParagraphs') return 'Description';
  if (key === 'overviewImages') return 'Image Uploads';
  if (key === 'challengeTitle') return 'Title';
  if (key === 'challengeDescription') return 'Description';
  if (key === 'challengeImage') return 'Image Upload';
  if (key === 'solutionsTitle') return 'Title';
  if (key === 'solutionsDescription') return 'Description';
  if (key === 'solutionModules') return 'Items';
  if (key === 'icon') return 'Icon Upload';
  if (key === 'name') return 'Item Name';
  if (key === 'subtitle' || key === 'smallTitle') return 'Tag';
  if (key === 'resultsTitle') return 'Title';
  if (key === 'resultsSubtitle') return 'Subtitle';
  if (key === 'resultsItems') return 'Points';
  if (key === 'resultsCtaDescription') return 'CTA Description';
  if (key === 'bgImage') return 'Background Image';
  if (key === 'badgeBgColor') return 'Badge Background Color';
  if (key === 'badgeColor' || key === 'badgeTextColor') return 'Badge Text Color';
  if (key === 'badgeBorderColor') return 'Badge Border Color';
  if (key === 'titleColor') return 'Title Text Color';
  if (key === 'titleSecondaryColor') return 'Title Secondary Color (Highlights 4th, 5th, 7th words)';
  if (key === 'descriptionColor') return 'Description Text Color';
  if (key === 'button1Color') return 'Button 1 Text Color';
  if (key === 'button2Color') return 'Button 2 Text Color';
  if (key === 'bgColor') return 'Background Color';
  if (key === 'dateColor') return 'Date Color';
  if (key === 'contact') return 'Contact (Email/Phone No.)';
  if (key === 'qutation' || key === 'quotation') return 'Question';
  if (key === 'tag1BgColor') return 'Tag 1 Background Color';
  if (key === 'tag1TextColor') return 'Tag 1 Text Color';
  if (key === 'tag1Text') return 'Tag 1 Text';
  if (key === 'tag2BgColor') return 'Tag 2 Background Color';
  if (key === 'tag2TextColor') return 'Tag 2 Text Color';
  if (key === 'tag2Text') return 'Tag 2 Text';
  if (key === 'buttonArrowColor') return 'Button Arrow Color';
  if (key === 'titleText') return 'Title Text';
  if (key === 'titleTextColor') return 'Title Text Color';
  if (key === 'badgeBgColor') return 'Badge Background Color';
  if (key === 'badgeBorderColor') return 'Badge Border Color';
  if (key === 'badgeTextColor') return 'Badge Text Color';
  if (key === 'descriptionTextColor') return 'Description Text Color';
  if (key === 'aboutTitle') return 'About Title';
  if (key === 'aboutText') return 'About Text';
  if (key === 'formHeader') return 'Form Header';
  if (key === 'formSubheader') return 'Form Sub Header';
  if (key === 'badgeIcon') return 'Badge Icon Upload';
  if (key === 'button1BgColor') return 'Button 1 Background Color';
  if (key === 'button1BorderColor') return 'Button 1 Border Color';
  if (key === 'button1Text') return 'Button 1 Text';
  if (key === 'button1TextColor') return 'Button 1 Text Color';
  if (key === 'button1Url') return 'Button 1 URL';
  if (key === 'button2BgColor') return 'Button 2 Background Color';
  if (key === 'button2BorderColor') return 'Button 2 Border Color';
  if (key === 'button2Text') return 'Button 2 Text';
  if (key === 'button2TextColor') return 'Button 2 Text Color';
  if (key === 'button2Url') return 'Button 2 URL';
  if (key === 'mediaUrl') return 'Media Upload (Image or Video)';
  if (key === 'buttonBgColor') return 'Button Background Color';
  if (key === 'buttonTextColor') return 'Button Text Color';
  if (key === 'tabs') return 'Category Tabs List';
  if (key === 'label') return 'Title';
  if (key === 'number') return 'Value';
  if (key === 'contentTitle') return 'Detail Title';
  if (key === 'contentDescription') return 'Detail Description';
  if (key === 'contentImage') return 'Detail Mockup Image';
  if (key === 'benefits') return 'Benefits Tags (Array)';
  if (key === 'buttonText') return 'CTA Text';
  if (key === 'buttonUrl') return 'CTA URL';
  if (key === 'buttonFormType') return 'Button Form Action';
  if (key === 'button1FormType') return 'Button 1 Form Action';
  if (key === 'button2FormType') return 'Button 2 Form Action';
  if (key === 'ctaFormType') return 'CTA Form Action';
  if (key.toLowerCase().endsWith('pdfurl') || key.toLowerCase().endsWith('pdf')) {
    const prefix = key.replace(/PdfUrl$|pdfUrl$|Pdf$|pdf$/, '');
    if (!prefix || prefix.toLowerCase() === 'cta') return 'CTA PDF Upload';
    return prefix
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) + ' PDF Upload';
  }
  if (key === 'tabTitle') return 'Tab Detail Title';
  
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const IMAGE_PATTERNS = ['image', 'thumbnail', 'avatar', 'logo', 'ogimage', 'photo', 'banner', 'icon_url', 'icon_image', 'icon', 'media', 'video', 'pdf'];
const URL_PATTERNS = ['url', 'href', 'link'];
const RICHTEXT_PATTERNS = ['description', 'desc', 'body', 'content', 'html', 'paragraph', 'text', 'summary', 'excerpt', 'answer', 'quote'];
const TEXTAREA_PATTERNS = ['subtitle', 'subheading', 'note', 'message'];
const COLOR_PATTERN = /^#([0-9a-f]{3}){1,2}$/i;
const ICON_PATTERNS = ['icon'];

export function detectFieldType(key: string, value: JsonValue, sectionType?: string): FieldType {
  if (key === 'autoScroll') return 'boolean';
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';

  if (typeof value === 'string') {
    const lower = key.toLowerCase();

    if (lower === 'tabdesc') return 'text';
    if (lower === 'topic') return 'topicSelect';
    if (lower === 'industry') return 'industrySelect';
    if (lower.endsWith('formtype')) return 'formSelect';
    if (lower === 'icon' && (sectionType === 'bi-business-impact' || sectionType === 'rpa-overview' || sectionType === 'rpa-capabilities' || sectionType === 'rpa-industries' || value.startsWith('/') || value.includes('.') || value.includes('://'))) return 'image';
    if (IMAGE_PATTERNS.some((p) => lower.includes(p)) && !lower.endsWith('alt')) return 'image';
    if (lower === 'color' || lower.endsWith('color') || lower.startsWith('color') || lower.includes('accent')) {
      if (COLOR_PATTERN.test(value) || value.startsWith('rgb') || value.startsWith('hsl')) return 'color';
    }
    if (COLOR_PATTERN.test(value)) return 'color';
    if (URL_PATTERNS.some((p) => lower === p || lower.endsWith(p.charAt(0).toUpperCase() + p.slice(1)) || lower.endsWith('_' + p))) return 'url';
    if (ICON_PATTERNS.some((p) => lower === p) && value.length < 50) return 'icon';
    if (lower === 'countrycode' || lower === 'country_code') return 'countryCode';

    if (RICHTEXT_PATTERNS.some((p) => lower.includes(p))) return 'richtext';
    if (TEXTAREA_PATTERNS.some((p) => lower.includes(p))) return 'textarea';
    if (value.length > 120) return 'textarea';

    return 'text';
  }

  return 'text';
}

export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const copy = structuredClone(obj);
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = copy;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const isIdx = /^\d+$/.test(k);
    if (isIdx) {
      current = current[Number(k)];
    } else {
      if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
        current[k] = /^\d+$/.test(keys[i + 1] ?? '') ? [] : {};
      }
      current = current[k];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (/^\d+$/.test(lastKey)) {
    current[Number(lastKey)] = value;
  } else {
    current[lastKey] = value;
  }

  return copy;
}

export function mergeSchemaWithContent(
  schema: Record<string, JsonValue> | undefined,
  content: Record<string, JsonValue>
): Record<string, JsonValue> {
  if (!schema) return content;

  const merged: Record<string, JsonValue> = {};
  const allKeys = new Set([...Object.keys(schema), ...Object.keys(content)]);

  for (const key of allKeys) {
    if (key in content) {
      merged[key] = content[key];
    } else if (key in schema) {
      merged[key] = schema[key];
    }
  }

  return merged;
}

export function createEmptyFromTemplate(template: JsonValue): JsonValue {
  if (template === null || template === undefined) return null;
  if (typeof template === 'string') return '';
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  if (Array.isArray(template)) return [];
  if (typeof template === 'object') {
    const obj: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(template)) {
      obj[k] = createEmptyFromTemplate(v as JsonValue);
    }
    return obj;
  }
  return null;
}
