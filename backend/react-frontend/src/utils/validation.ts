// Email validation
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

// Password validation
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

// Name validation
export function validateName(name: string): string | null {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.length > 50) {
    return 'Name must not exceed 50 characters';
  }
  return null;
}

// Phone validation
export function validatePhone(phone: string): string | null {
  if (!phone) {
    return null; // Phone is optional in most cases
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  return null;
}

// URL validation
export function validateUrl(url: string): string | null {
  if (!url) {
    return null; // URL is optional
  }
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL (including http:// or https://)';
  }
}

// Budget validation
export function validateBudget(budget: string | number): string | null {
  if (!budget) {
    return 'Budget is required';
  }
  const numBudget = typeof budget === 'string' ? parseFloat(budget) : budget;
  if (isNaN(numBudget)) {
    return 'Budget must be a valid number';
  }
  if (numBudget <= 0) {
    return 'Budget must be greater than 0';
  }
  if (numBudget > 10000000) {
    return 'Budget seems unreasonably high';
  }
  return null;
}

// Text length validation
export function validateTextLength(
  text: string,
  fieldName: string,
  minLength: number,
  maxLength: number
): string | null {
  if (!text) {
    return `${fieldName} is required`;
  }
  if (text.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (text.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
}

// Date validation
export function validateDate(date: string, fieldName: string = 'Date'): string | null {
  if (!date) {
    return `${fieldName} is required`;
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return `${fieldName} must be in the future`;
  }
  return null;
}

// Required field validation
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}

// Confirm password validation
export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

// Generic form validator
export interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
