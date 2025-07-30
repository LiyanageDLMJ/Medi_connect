import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export const authMiddleware: RequestHandler = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  console.log('x-user-id header:', req.headers['x-user-id']);
  
  const authHeader = req.headers.authorization;
  
  // Try JWT token first
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      console.log('Token decoded successfully:', decoded);
      (req as any).user = decoded;
      next();
      return;
    } catch (err) {
      console.log('Token verification failed:', err);
      // Don't return error yet, try fallback
    }
  }
  
  // Fallback: Check for x-user-id header (for development)
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    console.log('Using x-user-id fallback:', userId);
    (req as any).user = { id: userId };
    next();
    return;
  }
  
  // No valid authentication found
  console.log('No valid authentication found');
  res.status(401).json({ message: "No valid token or user ID provided" });
  return;
}; 