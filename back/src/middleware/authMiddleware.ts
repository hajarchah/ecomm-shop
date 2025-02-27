import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Add type definition for Request
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}