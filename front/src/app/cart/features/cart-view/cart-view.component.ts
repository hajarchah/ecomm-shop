import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../data-access/cart.service';
import { CartItem } from '../../data-access/cart-item.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, map } from 'rxjs';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent {
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  cartItems$ = this.cartService.cartItems$;
  
  subtotal$ = this.cartItems$.pipe(
    map(items => items.reduce(
      (total: number, item: CartItem) => total + (item.product.price * item.quantity), 
      0
    ))
  );

  tax$ = this.subtotal$.pipe(
    map(subtotal => subtotal * 0.20) // 20% tax
  );

  total$ = this.subtotal$.pipe(
    map(subtotal => subtotal * 1.20) // subtotal + 20% tax
  );

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    this.cartService.updateCart(item.product.id, newQuantity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cart updated successfully'
        });
      },
      error: (error) => {
        console.error('Error updating cart:', error);
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
      message: `Are you sure you want to remove ${item.product.name} from your cart?`,
      accept: () => {
        this.cartService.removeFromCart(item.product.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item removed from cart'
            });
          },
          error: (error) => {
            console.error('Error removing item:', error);
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
      accept: () => {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Cart cleared successfully'
            });
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
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

  onCheckout(): void {
    // Implement checkout logic here
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Checkout functionality coming soon!'
    });
  }
}
