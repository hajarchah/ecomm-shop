import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../data-access/cart.service';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeModule, ButtonModule],
  template: `
    <button 
      pButton 
      routerLink="/cart"
      class="p-button-text p-button-rounded" 
      icon="pi pi-shopping-cart">
      <p-badge *ngIf="cartItems.length > 0" [value]="cartItems.length.toString()"></p-badge>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class CartBadgeComponent {
  private cartService = inject(CartService);
  cartItems: any[] = [];

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }
}