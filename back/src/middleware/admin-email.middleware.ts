import { Request, Response, NextFunction } from 'express';

export const isAdminEmail = (req: Request, res: Response, next: NextFunction): void => {
  // Check if user exists in request (from JWT authentication)
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // Check if the user's email is specifically "admin@admin.com"
  if (req.user.email === 'admin@admin.com') {
    // User is the admin, allow access
    next();
  } else {
    // User is not the admin, deny access
    res.status(403).json({ 
      message: 'Access denied. Only the administrator can perform this action.' 
    });
  }
};