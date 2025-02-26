import { CartItem } from '../types/cartItem';
import { Product } from '../types/product';

export class CartService {
  private cart: CartItem[] = [];

  public getCart(): CartItem[] {
    console.log('Retrieving cart:', this.cart); // Add logging
    return this.cart;
  }

  public addToCart(product: Product, quantity: number): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
  }

  public updateCart(productId: number, quantity: number): void {
    const item = this.cart.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  public removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  public clearCart(): void {
    this.cart = [];
  }
}