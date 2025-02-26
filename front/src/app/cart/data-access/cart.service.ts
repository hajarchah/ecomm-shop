import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CartItem } from './cart-item.model';
import { Product } from '../../products/data-access/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.getCart().subscribe({
      next: (items) => this.cartItemsSubject.next(items),
      error: (error) => console.error('Error loading cart:', error)
    });
  }

  public getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  public addToCart(product: Product, quantity: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { product, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  public updateCart(id: number, quantity: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  public removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadCart())
    );
  }

  public clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartItemsSubject.next([]))
    );
  }

  public getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  public getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}