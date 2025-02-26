import { Product } from './product'; // Ensure this path is correct and consistent

export interface CartItem {
  product: Product;
  quantity: number;
}