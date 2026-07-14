/**
 * Validates a mobile/phone number based on the ISO country code.
 */
export const validatePhoneNumber = (phone: string, countryCode: string): { isValid: boolean; message: string } => {
  // Strip any non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (!digits) {
    return { isValid: false, message: 'Phone number is required.' };
  }

  const code = countryCode.toLowerCase();
  
  if (code === 'in') {
    // India: 10 digits, starting with 6, 7, 8, or 9
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(digits)) {
      return { isValid: false, message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.' };
    }
  } else if (code === 'us' || code === 'ca') {
    // US & Canada: 10 digits
    if (digits.length !== 10) {
      return { isValid: false, message: 'Please enter a valid 10-digit US/Canada phone number.' };
    }
  } else if (code === 'gb') {
    // UK: 10 digits starting with 7
    const regex = /^7\d{9}$/;
    if (!regex.test(digits)) {
      return { isValid: false, message: 'Please enter a valid 10-digit UK mobile number starting with 7.' };
    }
  } else {
    // Generic validation: between 7 and 15 digits
    if (digits.length < 7 || digits.length > 15) {
      return { isValid: false, message: 'Please enter a valid phone number (7 to 15 digits).' };
    }
  }

  return { isValid: true, message: '' };
};
