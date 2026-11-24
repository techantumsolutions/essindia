import libphonenumber from 'google-libphonenumber';
import { formatPhoneCountryLabel } from '@/lib/dial-codes';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const ValidationResult = libphonenumber.PhoneNumberUtil.ValidationResult;

const JUNK_SEQUENCES = new Set(['0123456789', '1234567890']);
const PHONE_ALLOWED_CHARS = /^[\d\s+\-().]+$/;

export type PhoneValidationSuccess = { isValid: true; message: ''; e164: string };
export type PhoneValidationFailure = { isValid: false; message: string };
export type PhoneValidationResult = PhoneValidationSuccess | PhoneValidationFailure;

function isJunkNationalNumber(national: string): boolean {
  if (!national) return true;
  if (/^(\d)\1+$/.test(national)) return true;
  return JUNK_SEQUENCES.has(national);
}

/**
 * Parse, validate for the selected region (mobile and landline), reject junk, return E.164.
 */
export function validateAndFormatPhone(raw: string, region: string, required = true): PhoneValidationResult {
  const value = String(raw || '').trim();
  if (!value) {
    if (!required) return { isValid: true, message: '', e164: '' };
    return { isValid: false, message: 'Please enter your phone number.' };
  }

  const iso = (region || '').trim().toUpperCase();
  if (!iso || iso.length !== 2) {
    return { isValid: false, message: 'Please select your country code.' };
  }

  const countryLabel = formatPhoneCountryLabel(iso);

  if (/[A-Za-z]/.test(value) || !PHONE_ALLOWED_CHARS.test(value)) {
    return { isValid: false, message: 'Phone numbers can only contain digits.' };
  }

  try {
    const parsed = phoneUtil.parse(value, iso);
    const possibility = phoneUtil.isPossibleNumberWithReason(parsed);

    if (possibility === ValidationResult.TOO_SHORT) {
      return {
        isValid: false,
        message: `This number appears too short for ${countryLabel}. Please check and try again.`,
      };
    }
    if (possibility === ValidationResult.TOO_LONG) {
      return {
        isValid: false,
        message: `This number appears too long for ${countryLabel}. Please check and try again.`,
      };
    }

    if (!phoneUtil.isValidNumberForRegion(parsed, iso)) {
      return {
        isValid: false,
        message: `Please enter a valid phone number for ${countryLabel}.`,
      };
    }

    const national = phoneUtil.getNationalSignificantNumber(parsed);
    if (isJunkNationalNumber(national)) {
      return {
        isValid: false,
        message: 'Please enter a valid phone number so our team can reach you.',
      };
    }

    const e164 = phoneUtil.format(parsed, libphonenumber.PhoneNumberFormat.E164);
    const digits = e164.replace(/\D/g, '');
    if (!e164.startsWith('+') || digits.length < 1 || digits.length > 15) {
      return {
        isValid: false,
        message: `Please enter a valid phone number for ${countryLabel}.`,
      };
    }

    return { isValid: true, message: '', e164 };
  } catch {
    const digitCount = value.replace(/\D/g, '').length;
    if (digitCount > 0 && digitCount < 7) {
      return {
        isValid: false,
        message: `This number appears too short for ${countryLabel}. Please check and try again.`,
      };
    }
    if (digitCount > 15) {
      return {
        isValid: false,
        message: `This number appears too long for ${countryLabel}. Please check and try again.`,
      };
    }
    return {
      isValid: false,
      message: `Please enter a valid phone number for ${countryLabel}.`,
    };
  }
}

/** Thin wrapper kept for existing callers; includes e164 when valid. */
export const validatePhoneNumber = (phone: string, countryCode: string): PhoneValidationResult =>
  validateAndFormatPhone(phone, countryCode);
