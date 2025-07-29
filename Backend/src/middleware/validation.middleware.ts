import { Request, Response, NextFunction } from 'express';

// Validation interfaces
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Validation middleware
export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const data = req.body;

    Object.keys(schema).forEach(field => {
      const value = data[field];
      const rule = schema[field];

      // Required field validation
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push({
          field,
          message: rule.message || `${field} is required`
        });
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) {
        return;
      }

      // String length validation
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field,
            message: rule.message || `${field} must be at least ${rule.minLength} characters long`
          });
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field,
            message: rule.message || `${field} cannot exceed ${rule.maxLength} characters`
          });
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field,
            message: rule.message || `${field} format is invalid`
          });
        }
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field,
          message: rule.message || `${field} validation failed`
        });
      }
    });

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(error => error.message)
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const adminRegistrationSchema: ValidationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'First name can only contain letters and spaces'
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Last name can only contain letters and spaces'
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  },
  conpassword: {
    required: true,
    custom: (value) => {
      // This will be validated in the controller since it needs access to the password field
      return true;
    }
  },
  mobileNumber: {
    required: true,
    pattern: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    message: 'Please enter a valid mobile number'
  },
  country: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  streetAddress: {
    required: true,
    minLength: 5,
    maxLength: 200
  }
};

export const userLoginSchema: ValidationSchema = {
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true
  }
};

export const passwordChangeSchema: ValidationSchema = {
  currentPassword: {
    required: true
  },
  newPassword: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }
};

export const profileUpdateSchema: ValidationSchema = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'First name can only contain letters and spaces'
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Last name can only contain letters and spaces'
  },
  mobileNumber: {
    pattern: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    message: 'Please enter a valid mobile number'
  },
  country: {
    minLength: 2,
    maxLength: 50
  },
  city: {
    minLength: 2,
    maxLength: 50
  },
  streetAddress: {
    minLength: 5,
    maxLength: 200
  }
};

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return password.length >= 8 && passwordRegex.test(password);
};

export const validateMobileNumber = (mobileNumber: string): boolean => {
  const mobileRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return mobileRegex.test(mobileNumber);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Rate limiting validation
export const validateRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // This is a basic implementation. In production, you'd want to use a proper rate limiting library
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // You can implement rate limiting logic here
  // For now, we'll just pass through
  next();
};

// File upload validation
export const validateFileUpload = (allowedTypes: string[], maxSizeMB: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return res.status(400).json({
        message: `File size must be less than ${maxSizeMB}MB`
      });
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: `File type must be one of: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

// Input sanitization middleware
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
}; 