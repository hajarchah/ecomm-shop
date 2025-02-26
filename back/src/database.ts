import { DataSource } from 'typeorm';
import { join } from 'path';
import { Product } from './entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(__dirname, '../data/database.sqlite'),
  entities: [Product],
  synchronize: true,
  logging: true // Enable SQL logging
});

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!isInitialized) {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log('Database initialized at:', join(__dirname, '../data/database.sqlite'));
      
      // Log table creation
      const tables = await AppDataSource.query(`
        SELECT name FROM sqlite_master WHERE type='table';
      `);
      console.log('Available tables:', tables);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};