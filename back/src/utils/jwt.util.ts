import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const JWT_EXPIRATION = '24h';

export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    isAdmin: user.email === 'admin@admin.com' // Set admin flag based on email
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};