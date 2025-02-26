import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  // GET /cart - Get all items in the cart
  public getCart = (req: Request, res: Response): void => {
    try {
      const cart = this.cartService.getCart();
      res.json(cart);
    } catch (error) {
      console.error('Error retrieving cart:', error); // Add logging
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
  };

  // POST /cart - Add an item to the cart
  public addToCart = (req: Request, res: Response): void => {
    try {
      const { product, quantity } = req.body;
      this.cartService.addToCart(product, quantity);
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error); // Add logging
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  };

  // PATCH /cart/:id - Update the quantity of an item in the cart
  public updateCart = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      this.cartService.updateCart(parseInt(id, 10), quantity);
      res.json({ message: 'Cart updated' });
    } catch (error) {
      console.error('Error updating cart:', error); // Add logging
      res.status(500).json({ error: 'Failed to update cart' });
    }
  };

  // DELETE /cart/:id - Remove an item from the cart
  public removeFromCart = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      this.cartService.removeFromCart(parseInt(id, 10));
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing item from cart:', error); // Add logging
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  };

  // DELETE /cart - Clear the entire cart
  public clearCart = (req: Request, res: Response): void => {
    try {
      this.cartService.clearCart();
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error); // Add logging
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
}

export default new CartController();