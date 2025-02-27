import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from 'app/products/data-access/product.model';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Exposing this as cart$ for components to subscribe to
  cart$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.http.get<CartItem[]>(this.apiUrl)
      .subscribe({
        next: (items) => {
          this.cartItemsSubject.next(items);
        },
        error: (error) => {
          console.error('Error loading cart', error);
        }
      });
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$;
  }

  addToCart(product: Product, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { productId: product.id, quantity })
      .pipe(
        tap(() => this.loadCart())
      );
  }

  updateQuantity(productId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${productId}`, { quantity })
      .pipe(
        tap(() => this.loadCart())
      );
  }

  removeFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`)
      .pipe(
        tap(() => this.loadCart())
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.cartItemsSubject.next([]);
      })
    );
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity, 0
    );
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    );
  }
}
