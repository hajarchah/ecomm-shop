import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[Auth] Processing request to: ${req.method} ${req.originalUrl}`);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('[Auth] No authorization header found');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    console.log('[Auth] No token found in authorization header');
    res.status(401).json({ message: 'Authentication token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    req.user = decoded;
    console.log(`[Auth] Successfully authenticated user: ${req.user.email}`);
    next();
  } catch (error) {
    console.error('[Auth] JWT verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};