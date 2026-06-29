export function getImageHint(sectionType: string, fieldKey: string): string {
  // Normalize field key for consistent matching
  const key = fieldKey.toLowerCase();

  // 1. Specific Section Overrides
  if (sectionType === 'mfg-hero' && key.includes('image')) {
    return 'Recommended: 800x800px (1:1 ratio) transparent PNG';
  }
  if (sectionType === 'mfg-icons' && key.includes('icon')) {
    return 'Recommended: 64x64px (1:1 ratio) SVG or PNG';
  }
  if (sectionType === 'mfg-process' && key.includes('image')) {
    return 'Recommended: 160x160px (1:1 ratio)';
  }
  if (sectionType === 'mfg-efficiency' && key.includes('image')) {
    return 'Recommended: 600x600px (1:1 ratio) transparent PNG';
  }
  if (sectionType === 'mfg-models' && key.includes('image')) {
    return 'Recommended: 400x300px (4:3 ratio)';
  }
  if (sectionType === 'hero' && key.includes('image')) {
    return 'Recommended: 1200x800px (16:9 ratio)';
  }
  
  // 2. Generic Field Name Fallbacks
  if (key.includes('icon')) {
    return 'Recommended: 64x64px (1:1 ratio) SVG or PNG';
  }
  if (key.includes('logo')) {
    return 'Recommended: 160x80px (2:1 ratio) transparent PNG';
  }
  if (key.includes('avatar') || key.includes('profile')) {
    return 'Recommended: 128x128px (1:1 ratio) JPEG or PNG';
  }
  if (key.includes('banner') || key.includes('hero')) {
    return 'Recommended: 1920x1080px (16:9 ratio) optimized WebP or JPEG';
  }
  if (key.includes('image')) {
    return 'Recommended: 800x600px (4:3 ratio) optimized WebP or JPEG';
  }
  
  // 3. Absolute Fallback
  return 'Max size 3MB. Optimized WebP, JPEG, or PNG recommended.';
}
