import fs from 'fs';
import path from 'path';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';


export class ProductModel extends Product {
  // Get all products
  public static async getAllProducts(): Promise<Product[]> {
    return await ProductRepository.find();
  }

  // Get a product by ID
  public static async getProductById(id: number): Promise<Product | null> {
    return await ProductRepository.findOneBy({ id });
  }

  // Add a new product
  public static async addProduct(product: Partial<Product>): Promise<Product> {
    const now = Date.now();
    const newProduct = ProductRepository.create({
      ...product,
      createdAt: now,
      updatedAt: now
    });
    return await ProductRepository.save(newProduct);
  }

  // Update a product by ID
  public static async updateProduct(id: number, updatedProduct: Partial<Product>): Promise<Product | null> {
    const product = await ProductRepository.findOneBy({ id });
    
    if (!product) {
      return null;
    }
    
    ProductRepository.merge(product, {
      ...updatedProduct,
      updatedAt: Date.now()
    });
    
    return await ProductRepository.save(product);
  }

  // Delete a product by ID
  public static async deleteProduct(id: number): Promise<boolean> {
    const result = await ProductRepository.delete(id);
    // Use nullish coalescing to provide a default of 0 when affected is undefined or null
    return (result?.affected ?? 0) > 0;
  }
}

export default ProductModel;