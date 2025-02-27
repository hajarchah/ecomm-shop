import { CartItem } from '../types/cartItem';
import { Product } from '../types/product';

// Store carts by user ID
const userCarts: { [userId: string]: CartItem[] } = {};

export class CartService {
  // Get cart for a specific user
  public getCart(userId: string): CartItem[] {
    // Initialize empty cart if doesn't exist yet
    if (!userCarts[userId]) {
      userCarts[userId] = [];
    }
    return userCarts[userId];
  }

  // Add item to user's cart
  public addToCart(userId: string, product: Product, quantity: number): CartItem {
    const cart = this.getCart(userId);
    
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    } else {
      const newItem = { product, quantity };
      cart.push(newItem);
      return newItem;
    }
  }

  // Update quantity of an item in user's cart
  public updateCart(userId: string, productId: number, quantity: number): CartItem | null {
    const cart = this.getCart(userId);
    const item = cart.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      return item;
    }
    return null;
  }

  // Remove item from user's cart
  public removeFromCart(userId: string, productId: number): boolean {
    const cart = this.getCart(userId);
    const initialLength = cart.length;
    userCarts[userId] = cart.filter(item => item.product.id !== productId);
    return initialLength !== userCarts[userId].length;
  }

  // Clear user's entire cart
  public clearCart(userId: string): void {
    userCarts[userId] = [];
  }
}

// Export as singleton
export const cartService = new CartService();