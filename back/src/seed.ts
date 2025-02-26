import { readFile } from 'fs/promises';
import { join } from 'path';
import { AppDataSource } from './database';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';

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

export default seedDatabase;