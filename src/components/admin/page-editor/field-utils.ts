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
  | 'null';

export function humanLabel(key: string): string {
  if (key === 'subtitle') return 'Tag';
  if (key === 'bgImage') return 'Background Image';
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const IMAGE_PATTERNS = ['image', 'thumbnail', 'avatar', 'logo', 'ogimage', 'photo', 'banner', 'icon_url', 'icon_image'];
const URL_PATTERNS = ['url', 'href', 'link'];
const RICHTEXT_PATTERNS = ['description', 'body', 'content', 'html', 'paragraph', 'text', 'summary', 'excerpt', 'answer', 'quote'];
const TEXTAREA_PATTERNS = ['subtitle', 'subheading', 'note', 'message'];
const COLOR_PATTERN = /^#([0-9a-f]{3}){1,2}$/i;
const ICON_PATTERNS = ['icon'];

export function detectFieldType(key: string, value: JsonValue): FieldType {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';

  if (typeof value === 'string') {
    const lower = key.toLowerCase();

    if (IMAGE_PATTERNS.some((p) => lower.includes(p)) && !lower.endsWith('alt')) return 'image';
    if (lower === 'color' || lower.endsWith('color') || lower.startsWith('color') || lower.includes('accent')) {
      if (COLOR_PATTERN.test(value) || value.startsWith('rgb') || value.startsWith('hsl')) return 'color';
    }
    if (COLOR_PATTERN.test(value)) return 'color';
    if (URL_PATTERNS.some((p) => lower === p || lower.endsWith(p.charAt(0).toUpperCase() + p.slice(1)) || lower.endsWith('_' + p))) return 'url';
    if (ICON_PATTERNS.some((p) => lower === p) && value.length < 50) return 'icon';
    if (lower === 'countrycode' || lower === 'country_code') return 'countryCode';

    if (RICHTEXT_PATTERNS.some((p) => lower === p || lower.endsWith(p.charAt(0).toUpperCase() + p.slice(1)))) return 'richtext';
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
