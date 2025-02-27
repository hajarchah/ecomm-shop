import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import authRoutes from './routes/authRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import { initializeDatabase } from './database';
import seedDatabase from './seed';
import { seedAdminUser } from './seed';
import { authenticateJWT, isAdmin } from './middleware/auth.middleware';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// Initialize app
const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add to top part of server.ts
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  next();
});

// Root route - public
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ALTEN Shop API' });
});

// Public auth routes
app.use('/api', authRoutes); // Makes auth routes available at /api/register, /api/login, etc.

// Protected routes (require authentication) - these should come AFTER public routes
app.use('/api/products', productRoutes); // Products are public
app.use('/api/cart', authenticateJWT, cartRoutes);
app.use('/api/contact', authenticateJWT, contactRoutes);
app.use('/api/wishlist', authenticateJWT, wishlistRoutes);

// Admin-only routes
app.use('/api/admin', authenticateJWT, isAdmin, adminRoutes); // Only admins can access admin routes

// Protected product modification routes (POST, PATCH, DELETE)
app.post('/api/products', authenticateJWT, isAdmin, (req, res, next) => next());
app.patch('/api/products/:id', authenticateJWT, isAdmin, (req, res, next) => next());
app.delete('/api/products/:id', authenticateJWT, isAdmin, (req, res, next) => next());

// Start server
async function startServer() {
  try {
    // Initialize database connection
    const dataSource = await initializeDatabase();
    await dataSource.synchronize();
    console.log('Database schema synchronized');
    
    // Seed the admin user
    await seedAdminUser();
    
    // Seed the database with initial products
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default startServer;