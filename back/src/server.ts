import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import adminRoutes from './routes/adminRoutes';
import { initializeDatabase } from './database';
import seedDatabase from './seed';

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

// Routes
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ALTEN Shop API' });
});

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
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

// If this file is directly executed, start the server
if (require.main === module) {
  startServer();
}

export default startServer;