import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GradientColors {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
}

export function getHeroBackgroundStyles(
  content?: GradientColors,
  defaultStyles?: React.CSSProperties
): React.CSSProperties {
  const c1 = content?.gradientColor1;
  const c2 = content?.gradientColor2;
  const c3 = content?.gradientColor3;

  const colors = [c1, c2, c3]
    .map((c) => (c ? c.replace(/\u200B/g, '').trim() : ''))
    .filter((c) => c !== '' && c !== 'transparent');

  if (colors.length === 0) {
    return defaultStyles || {};
  }

  if (colors.length === 1) {
    return {
      backgroundColor: colors[0],
      backgroundImage: 'none',
      ...((defaultStyles && 'color' in defaultStyles) ? { color: defaultStyles.color } : {})
    };
  }

  if (colors.length === 2) {
    return {
      backgroundImage: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      backgroundColor: 'transparent',
      ...((defaultStyles && 'color' in defaultStyles) ? { color: defaultStyles.color } : {})
    };
  }

  // 3 colors
  return {
    backgroundImage: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
    backgroundColor: 'transparent',
    ...((defaultStyles && 'color' in defaultStyles) ? { color: defaultStyles.color } : {})
  };
}

export function safeImageUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const cleaned = url.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!cleaned) return fallback;

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      new URL(cleaned);
      return cleaned;
    } catch {
      return fallback;
    }
  }

  if (cleaned.startsWith('/') || cleaned.startsWith('data:')) {
    return cleaned;
  }

  // Handle relative image path missing leading slash
  if (/^[a-zA-Z0-9_\-\.\/]+$/.test(cleaned) && !cleaned.includes('://')) {
    return `/${cleaned}`;
  }

  return fallback;
}

export function formatChatTime(dateStr?: string | Date | null): string {
  if (!dateStr) return '';
  try {
    let str = typeof dateStr === 'string' ? dateStr.trim() : (dateStr instanceof Date ? dateStr.toISOString() : String(dateStr));
    if (str.includes(' ') && !str.includes('T')) {
      str = str.replace(' ', 'T');
    }
    if (!str.endsWith('Z') && !str.includes('+') && !str.includes('-')) {
      str += 'Z';
    }
    const d = new Date(str);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}
