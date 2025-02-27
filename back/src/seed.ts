import { readFile } from 'fs/promises';
import { join } from 'path';
import { AppDataSource } from './database';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Check if products already exist
    const existingProducts = await ProductRepository.count();
    console.log('Existing products count:', existingProducts);

    if (existingProducts > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    // Read products data
    const filePath = join(__dirname, '../data/products.json');
    console.log('Reading products from:', filePath);
    
    const productsData = await readFile(filePath, 'utf-8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products in JSON file`);

    // Save products to database
    const savedProducts = await ProductRepository.save(products);
    console.log(`Successfully saved ${savedProducts.length} products to database`);

    // Verify saved products
    const verifyCount = await ProductRepository.count();
    console.log('Final products count in database:', verifyCount);

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

export const createContactsTable = async () => {
  try {
    // Check if contacts table already exists
    const tables = await AppDataSource.query('SELECT name FROM sqlite_master WHERE type="table" AND name="contacts"');
    
    if (tables.length === 0) {
      console.log('Creating contacts table...');
      
      // Create contacts table manually
      await AppDataSource.query(`
        CREATE TABLE "contacts" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" varchar NOT NULL,
          "email" varchar NOT NULL,
          "subject" varchar NOT NULL,
          "message" text NOT NULL,
          "status" varchar DEFAULT ('new') NOT NULL,
          "createdAt" bigint NOT NULL
        )
      `);
      
      console.log('Contacts table created successfully');
    } else {
      console.log('Contacts table already exists');
    }
  } catch (error) {
    console.error('Error creating contacts table:', error);
    throw error;
  }
};

export const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await UserRepository.findOne({
      where: { email: 'admin@admin.com' }
    });

    if (!existingAdmin) {
      console.log('Creating admin user...');
      
      const admin = new User();
      admin.username = 'admin';
      admin.email = 'admin@admin.com';
      admin.password = 'admin123'; // Will be hashed by @BeforeInsert hook
      admin.isAdmin = true;
      
      await UserRepository.save(admin);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

export default seedDatabase;