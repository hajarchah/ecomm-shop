import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../data-access/cart.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, map } from 'rxjs';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit {
  // Use cart$ from CartService
  cart$ = this.cartService.cart$;
  
  // Derived calculations
  subtotal$ = this.cart$.pipe(
    map((items: CartItem[]) => items.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    ))
  );
  
  tax$ = this.subtotal$.pipe(
    map((subtotal: number) => subtotal * 0.20) // 20% tax
  );
  
  total$ = this.subtotal$.pipe(
    map((subtotal: number) => subtotal * 1.20) // subtotal + 20% tax
  );

  constructor(
    private cartService: CartService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  updateQuantity(item: CartItem, newQuantity: number): void {
    // Use updateQuantity instead of updateCartItem
    this.cartService.updateQuantity(item.product.id, newQuantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Cart updated successfully'
        });
      },
      error: (error: any) => {
        console.error('Error updating cart', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update cart'
        });
      }
    });
  }

  removeItem(item: CartItem): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item from your cart?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Ensure we're passing a number, not a string
        this.cartService.removeFromCart(item.product.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Removed',
              detail: 'Item removed from cart'
            });
          },
          error: (error: any) => {
            console.error('Error removing item', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to remove item'
            });
          }
        });
      }
    });
  }

  clearCart(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear your cart?',
      header: 'Confirm Clear Cart',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Cart Cleared',
              detail: 'Your cart has been cleared'
            });
          },
          error: (error: any) => {
            console.error('Error clearing cart', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to clear cart'
            });
          }
        });
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
