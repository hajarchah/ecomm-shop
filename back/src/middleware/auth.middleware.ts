import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[Auth] Processing request to: ${req.method} ${req.originalUrl}`);
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth] No valid authorization header found');
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('[Auth] No token found in authorization header');
      res.status(401).json({ message: 'Authentication token is required' });
      return;
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-default-secret'
    ) as JWTPayload;

    // Validate decoded token structure
    if (!decoded.userId || !decoded.email) {
      console.error('[Auth] Invalid token payload structure');
      res.status(401).json({ message: 'Invalid token structure' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    console.log(`[Auth] Successfully authenticated user: ${req.user.email}`);
    next();
  } catch (error) {
    console.error('[Auth] JWT verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(500).json({ message: 'Internal authentication error' });
    }
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    console.log('[Auth] No user found in request for admin check');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    console.log(`[Auth] User ${req.user.email} attempted admin access without permission`);
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  console.log(`[Auth] Admin access granted to user: ${req.user.email}`);
  next();
};