import countryCodesList from 'country-codes-list';

export const DEFAULT_PHONE_COUNTRY = 'in';

export const DIAL_CODES = (
  countryCodesList.customArray({
    name: '{countryNameEn}',
    code: '{countryCode}',
    dialCode: '+{countryCallingCode}',
  }) as Array<{ name: string; code: string; dialCode: string }>
)
  .map((c) => ({
    ...c,
    code: c.code.toLowerCase(),
  }))
  .filter((c, index, self) => index === self.findIndex((t) => t.dialCode === c.dialCode));

export function getDialInfo(region: string) {
  const code = (region || '').trim().toLowerCase();
  return DIAL_CODES.find((c) => c.code === code) || null;
}

export function formatPhoneCountryLabel(region: string): string {
  const info = getDialInfo(region);
  if (!info) return (region || '').trim().toUpperCase() || 'the selected country';
  return `${info.name} (${info.dialCode})`;
}
