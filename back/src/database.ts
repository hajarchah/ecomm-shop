import { DataSource } from 'typeorm';
import { join } from 'path';
import { Product } from './entities/product.entity';
import { Contact } from './entities/contact.entity';
import { User } from './entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || join(__dirname, '../data/database.sqlite'),
  entities: [Product, Contact, User, Wishlist], // Add Wishlist to entities
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: [],
  subscribers: []
});

let dataSourceInitialized = false;

export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    // Only initialize if not already initialized
    if (!dataSourceInitialized) {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      dataSourceInitialized = true;
      console.log('Database initialized successfully');
    } else {
      console.log('Using existing database connection');
    }
    
    // Debug information to confirm entities are registered
    console.log('Registered entities:', AppDataSource.entityMetadatas.map(e => e.name));
    
    // Log available tables
    const tables = await AppDataSource.query('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('Available tables:', tables);
    
    return AppDataSource; // Return the DataSource object
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Add a function to close the connection when needed
export async function closeDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    dataSourceInitialized = false;
    console.log("Database connection closed");
  }
}