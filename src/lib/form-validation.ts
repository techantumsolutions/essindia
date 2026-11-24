export const MESSAGE_MAX_LENGTH = 2000;

export const FORM_SUBMIT_ERROR = 'Something went wrong on our end. Please try again in a moment.';
export const FORM_RATE_LIMIT_ERROR = 'Too many attempts. Please wait a few minutes and try again.';
export const FORM_SUCCESS_MESSAGE = 'Thank you. Our team will be in touch within one business day.';
export const FORM_PRIVACY_ERROR = 'Please accept our privacy policy to continue.';
export const FORM_COUNTRY_ERROR = 'Please select your country.';

export type FieldValidation = { isValid: true; message: '' } | { isValid: false; message: string };

const NAME_ALLOWED = /^[\p{L}](?:[\p{L} .'-]*[\p{L}])?$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(raw: string, required = true): FieldValidation {
  const value = (raw || '').trim();
  if (!value) {
    if (!required) return { isValid: true, message: '' };
    return { isValid: false, message: 'Please enter your full name.' };
  }
  if (value.length < 2) {
    return { isValid: false, message: 'Please enter your full name.' };
  }
  if (!NAME_ALLOWED.test(value) || /[0-9]/.test(value)) {
    return { isValid: false, message: 'Please use letters only in your name.' };
  }
  return { isValid: true, message: '' };
}

export function validateEmail(raw: string, required = true): FieldValidation {
  const value = (raw || '').trim();
  if (!value) {
    if (!required) return { isValid: true, message: '' };
    return { isValid: false, message: 'Please enter your email address.' };
  }
  if (!EMAIL_PATTERN.test(value)) {
    return { isValid: false, message: 'Please enter a valid email address, for example name@company.com.' };
  }
  return { isValid: true, message: '' };
}

export function validateCompany(raw: string, required = false): FieldValidation {
  const value = (raw || '').trim();
  if (!value) {
    if (!required) return { isValid: true, message: '' };
    return { isValid: false, message: 'Please enter your company name.' };
  }
  if (value.length < 2) {
    return { isValid: false, message: 'Please enter your full company name.' };
  }
  return { isValid: true, message: '' };
}

export function validateMessage(raw: string, required = false): FieldValidation {
  const value = (raw || '').trim();
  if (!value) {
    if (!required) return { isValid: true, message: '' };
    return { isValid: false, message: 'Please tell us briefly how we can help.' };
  }
  if (value.length < 10) {
    return {
      isValid: false,
      message: 'Please share a few more details so we can connect you with the right expert.',
    };
  }
  if (value.length > MESSAGE_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`,
    };
  }
  return { isValid: true, message: '' };
}

export function validatePrivacy(accepted: boolean): FieldValidation {
  if (!accepted) {
    return { isValid: false, message: FORM_PRIVACY_ERROR };
  }
  return { isValid: true, message: '' };
}

export function submitErrorMessage(status?: number, fallback?: string): string {
  if (status === 429) return FORM_RATE_LIMIT_ERROR;
  if (fallback && fallback.trim()) return fallback;
  return FORM_SUBMIT_ERROR;
}
