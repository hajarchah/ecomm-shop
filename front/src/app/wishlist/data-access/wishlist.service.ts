import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from 'app/products/data-access/product.model';

export interface WishlistItem {
  id: number;
  product: Product;
  addedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.http.get<WishlistItem[]>(this.apiUrl)
      .subscribe({
        next: (wishlist) => {
          this.wishlistSubject.next(wishlist);
        },
        error: (error) => {
          console.error('Error loading wishlist', error);
        }
      });
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlist$;
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId }).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.loadWishlist())
    );
  }

  isInWishlist(productId: number): Observable<{ isInWishlist: boolean }> {
    return this.http.get<{ isInWishlist: boolean }>(`${this.apiUrl}/check/${productId}`);
  }
}