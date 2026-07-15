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

  const colors = [c1, c2, c3].filter((c) => c && c.trim() !== '' && c !== 'transparent');

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
    backgroundImage: `radial-gradient(100% 100% at 50% 0%, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
    backgroundColor: 'transparent',
    ...((defaultStyles && 'color' in defaultStyles) ? { color: defaultStyles.color } : {})
  };
}
