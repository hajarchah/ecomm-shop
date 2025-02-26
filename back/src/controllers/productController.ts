import { Request, Response } from 'express';
import ProductModel from '../models/productModel';

class ProductController {
  // GET /products - Get all products
  public getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await ProductModel.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  };

  // GET /products/:id - Get a product by ID
  public getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await ProductModel.getProductById(parseInt(id, 10));
      
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error retrieving product:', error);
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  };

  // POST /products - Add a new product
  public createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = req.body;
      const newProduct = await ProductModel.addProduct(product);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  };

  // PATCH /products/:id - Update a product by ID
  public updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedProduct = req.body;
      const product = await ProductModel.updateProduct(parseInt(id, 10), updatedProduct);
      
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  };

  // DELETE /products/:id - Delete a product by ID
  public deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await ProductModel.deleteProduct(parseInt(id, 10));
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  };
}

export default new ProductController();