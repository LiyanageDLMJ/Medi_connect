import { NextFunction } from "express";

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is like a security guard checking IDs
const authenticate = async (req , res, next) => {
  try {
    // Get the ID card (token) from the person
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no ID card, don't let them in
    if (!token) {
      return res.status(401).json({ message: 'You need to login first!' });
    }

    // Check if the ID card is real
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    // If person doesn't exist, don't let them in
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Put the user info in the request so we can use it later
    req.user = user;
    next(); // Let them pass through
  } catch (error) {
    res.status(401).json({ message: 'Invalid login' });
  }
};

module.exports = authenticate;