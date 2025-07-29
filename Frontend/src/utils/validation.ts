// Validation utility functions for consistent validation across the application

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationErrors {
  [key: string]: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!passwordRegex.test(password)) {
    return { 
      isValid: false, 
      error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" 
    };
  }
  
  return { isValid: true };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Confirm password is required" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  
  return { isValid: true };
};

// Name validation (first name, last name)
export const validateName = (name: string, fieldName: string = "Name"): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} cannot exceed 50 characters` };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters and spaces` };
  }
  
  return { isValid: true };
};

// Mobile number validation
export const validateMobileNumber = (mobileNumber: string): ValidationResult => {
  if (!mobileNumber.trim()) {
    return { isValid: false, error: "Mobile number is required" };
  }
  
  const mobileRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  if (!mobileRegex.test(mobileNumber)) {
    return { isValid: false, error: "Please enter a valid mobile number" };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string, fieldName: string = "Address"): ValidationResult => {
  if (!address.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (address.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (address.length > 200) {
    return { isValid: false, error: `${fieldName} cannot exceed 200 characters` };
  }
  
  return { isValid: true };
};

// Country validation
export const validateCountry = (country: string): ValidationResult => {
  if (!country.trim()) {
    return { isValid: false, error: "Country is required" };
  }
  
  if (country.length < 2) {
    return { isValid: false, error: "Country must be at least 2 characters long" };
  }
  
  if (country.length > 50) {
    return { isValid: false, error: "Country cannot exceed 50 characters" };
  }
  
  return { isValid: true };
};

// City validation
export const validateCity = (city: string): ValidationResult => {
  if (!city.trim()) {
    return { isValid: false, error: "City is required" };
  }
  
  if (city.length < 2) {
    return { isValid: false, error: "City must be at least 2 characters long" };
  }
  
  if (city.length > 50) {
    return { isValid: false, error: "City cannot exceed 50 characters" };
  }
  
  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value?.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: "URL is required" };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

// Phone number validation (international format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }
  
  // International phone number regex
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  
  return { isValid: true };
};

// Date validation
export const validateDate = (date: string): ValidationResult => {
  if (!date) {
    return { isValid: false, error: "Date is required" };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }
  
  return { isValid: true };
};

// Age validation
export const validateAge = (birthDate: string, minAge: number = 18): ValidationResult => {
  const dateValidation = validateDate(birthDate);
  if (!dateValidation.isValid) {
    return dateValidation;
  }
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old` };
  }
  
  return { isValid: true };
};

// File size validation
export const validateFileSize = (file: File, maxSizeMB: number): ValidationResult => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): ValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true };
};

// Generic form validation
export const validateForm = (formData: any, validationRules: any): FormValidationErrors => {
  const errors: FormValidationErrors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rule = validationRules[field];
    
    if (rule.required && !value?.trim()) {
      errors[field] = `${rule.fieldName || field} is required`;
      return;
    }
    
    if (value && rule.validator) {
      const result = rule.validator(value, formData);
      if (!result.isValid) {
        errors[field] = result.error;
      }
    }
  });
  
  return errors;
};

// Sanitize input data
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Validate form submission
export const canSubmitForm = (errors: FormValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
}; 