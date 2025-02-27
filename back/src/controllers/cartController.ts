import { Request, Response } from 'express';
import { cartService } from '../services/cartService';
import { ProductModel } from '../models/productModel';

class CartController {
  // GET /cart - Get all items in the cart
  public getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const cart = cartService.getCart(String(userId));
      res.json(cart);
    } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
  };

  // POST /cart - Add an item to the cart
  public addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { productId, quantity } = req.body;
      
      // Validate input
      if (!productId || !quantity || quantity < 1) {
        res.status(400).json({ error: 'Invalid product ID or quantity' });
        return;
      }
      
      // Get product from database
      const product = await ProductModel.getProductById(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      const cartItem = cartService.addToCart(String(userId), product, quantity);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  };

  // PUT/PATCH /cart/:id - Update the quantity of an item in the cart
  public updateCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const productId = parseInt(req.params.id, 10);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        res.status(400).json({ error: 'Invalid quantity' });
        return;
      }
      
      const updatedItem = cartService.updateCart(String(userId), productId, quantity);
      if (updatedItem) {
        res.json(updatedItem);
      } else {
        res.status(404).json({ error: 'Item not found in cart' });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Failed to update cart' });
    }
  };

  // DELETE /cart/:id - Remove an item from the cart
  public removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const productId = parseInt(req.params.id, 10);
      
      const removed = cartService.removeFromCart(String(userId), productId);
      if (removed) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Item not found in cart' });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  };

  // DELETE /cart - Clear the entire cart
  public clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      cartService.clearCart(String(userId));
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
}

export default new CartController();