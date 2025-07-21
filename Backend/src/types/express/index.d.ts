import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        institution?: string;
        instituteName?: string;
        // Add other user properties as needed
      };
    }
  }
}

export {}; 