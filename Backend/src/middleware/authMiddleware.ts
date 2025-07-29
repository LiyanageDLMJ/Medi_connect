import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware: RequestHandler = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No valid authorization header found');
    res.status(401).json({ message: "No token provided" });
    return;
  }
  
  const token = authHeader.split(" ")[1];
  console.log('Token extracted:', token ? 'Present' : 'Missing');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    console.log('Token decoded successfully:', decoded);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}; 