import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';

class AuthController {
  // Register
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Registration request received:', req.body);
      const { username, email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const newUser = await UserModel.createUser({
        username: username || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'user' // Default role
      });
      
      // Generate JWT
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role || 'user'
        },
        process.env.JWT_SECRET || 'your-default-secret',
        { expiresIn: '24h' }
      );
      
      // Return success with token
      const { password: _, ...userData } = newUser;
      res.status(201).json({ token, user: userData });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  };
  
  // Login
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Login request received:', req.body);
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        console.log(`User not found for email: ${email}`);
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`Invalid password for user: ${email}`);
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      
      console.log(`Successful login for: ${email}`);
      
      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role || 'user'
        },
        process.env.JWT_SECRET || 'your-default-secret',
        { expiresIn: '24h' }
      );
      
      // Return success
      const { password: _, ...userData } = user;
      res.status(200).json({ token, user: userData });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  };
}

export default new AuthController();