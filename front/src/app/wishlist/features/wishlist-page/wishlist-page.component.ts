import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../data-access/wishlist.service';
import { CartService } from '../../../cart/data-access/cart.service';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product } from 'app/products/data-access/product.model';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="wishlist-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      
      <div class="page-title">
        <h1>My Wishlist</h1>
      </div>
      
      <div class="card">
        <ng-container *ngIf="wishlistItems && wishlistItems.length > 0; else emptyWishlist">
          <p-table [value]="wishlistItems" styleClass="p-datatable-sm" responsiveLayout="stack" breakpoint="960px">
            <ng-template pTemplate="header">
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>
                  <img [src]="item.product.image" 
                       [alt]="item.product.name" 
                       class="product-image"
                       (click)="viewProductDetails(item.product.id)">
                </td>
                <td>
                  <div class="product-name" (click)="viewProductDetails(item.product.id)">
                    {{ item.product.name }}
                  </div>
                  <div class="product-category">
                    {{ item.product.category }}
                  </div>
                </td>
                <td>{{ item.product.price | currency:'USD' }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      pButton 
                      icon="pi pi-shopping-cart" 
                      class="p-button-rounded p-button-success p-button-sm" 
                      (click)="addToCart(item.product)"
                      title="Add to Cart"
                    ></button>
                    <button 
                      pButton 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-danger p-button-sm ml-2" 
                      (click)="confirmRemove(item.product.id)"
                      title="Remove from Wishlist"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-container>
        
        <ng-template #emptyWishlist>
          <div class="empty-wishlist">
            <i class="pi pi-heart-fill empty-icon"></i>
            <h3>Your wishlist is empty</h3>
            <p>Add items to your wishlist by clicking the heart icon on products</p>
            <button pButton label="Browse Products" icon="pi pi-search" routerLink="/products"></button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-title {
      margin-bottom: 2rem;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1rem;
    }
    
    .page-title h1 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }
    
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .product-image:hover {
      transform: scale(1.05);
    }
    
    .product-name {
      font-weight: bold;
      cursor: pointer;
      color: #2196F3;
    }
    
    .product-name:hover {
      text-decoration: underline;
    }
    
    .product-category {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.25rem;
    }
    
    .action-buttons {
      display: flex;
      align-items: center;
    }
    
    .ml-2 {
      margin-left: 0.5rem;
    }
    
    .empty-wishlist {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }
    
    .empty-icon {
      font-size: 4rem;
      color: #e0e0e0;
      margin-bottom: 1rem;
    }
    
    .empty-wishlist h3 {
      margin: 1rem 0;
      color: #333;
    }
    
    .empty-wishlist p {
      color: #666;
      margin-bottom: 1.5rem;
      max-width: 400px;
    }
    
    @media (max-width: 768px) {
      .wishlist-container {
        padding: 1rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .ml-2 {
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class WishlistPageComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  loading = false;
  
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadWishlist();
  }
  
  loadWishlist(): void {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load wishlist items'
        });
        this.loading = false;
      }
    });
  }
  
  viewProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Cart',
          detail: `${product.name} added to your cart`
        });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add item to cart'
        });
      }
    });
  }
  
  confirmRemove(productId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item from your wishlist?',
      header: 'Remove Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeFromWishlist(productId);
      }
    });
  }
  
  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.product.id !== productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Removed',
          detail: 'Item removed from wishlist'
        });
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove item from wishlist'
        });
      }
    });
  }
}
