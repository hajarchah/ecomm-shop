import axios from 'axios';
import { ProductModel } from './models/productModel';
import { Product } from './types/product';

const BASE_URL = 'http://localhost:3000/api';

async function testApi(): Promise<void> {
  console.log('\n=== Testing ALTEN Shop API ===\n');
  
  try {
    // GET all products
    console.log('1. GET all products:');
    const getAllResponse = await axios.get(`${BASE_URL}/products`);
    const allProducts = getAllResponse.data as ProductModel[];
    console.log(`Status: ${getAllResponse.status} ${getAllResponse.statusText}`);
    console.log(`Found ${allProducts.length} products`);
    
    // Create a new product
    console.log('\n2. CREATE a new product:');
    const newProduct = {
      code: 'TEST001',
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test',
      price: 99.99,
      quantity: 10,
      inventoryStatus: 'INSTOCK'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/products`, newProduct);
    const createdProduct = createResponse.data as Product;
    console.log(`Status: ${createResponse.status} ${createResponse.statusText}`);
    console.log('Created product:', createdProduct);
    
    // GET product by ID
    console.log(`\n3. GET product by ID (${createdProduct.id}):`);
    const getByIdResponse = await axios.get(`${BASE_URL}/products/${createdProduct.id}`);
    const retrievedProduct = getByIdResponse.data as Product;
    console.log(`Status: ${getByIdResponse.status} ${getByIdResponse.statusText}`);
    console.log('Retrieved product:', retrievedProduct);
    
    // UPDATE product
    console.log(`\n4. UPDATE product (${createdProduct.id}):`);
    const updateData = {
      name: 'Updated Test Product',
      price: 129.99
    };
    
    const updateResponse = await axios.patch(`${BASE_URL}/products/${createdProduct.id}`, updateData);
    const updatedProduct = updateResponse.data as Product;
    console.log(`Status: ${updateResponse.status} ${updateResponse.statusText}`);
    console.log('Updated product:', updatedProduct);
    
    // DELETE product
    console.log(`\n5. DELETE product (${createdProduct.id}):`);
    const deleteResponse = await axios.delete(`${BASE_URL}/products/${createdProduct.id}`);
    console.log(`Status: ${deleteResponse.status} ${deleteResponse.statusText}`);
    
    // Verify deletion by trying to get the product
    console.log(`\n6. Verify deletion (${createdProduct.id}):`);
    try {
      await axios.get(`${BASE_URL}/products/${createdProduct.id}`);
      console.log('WARNING: Product not deleted');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`Status: ${error.response.status}`);
        console.log('Product successfully deleted!');
      } else {
        throw error;
      }
    }
    
    console.log('\nAPI Tests Completed!');
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Test Error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else if (error instanceof Error) {
      console.error('API Test Error:', error.message);
    } else {
      console.error('Unknown API Test Error');
    }
  }
}

// Run the tests
testApi();