import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { CartService } from '../../../cart/data-access/cart.service';
import { User } from '../../../auth/models/auth.models';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    MenubarModule,
    BadgeModule,
    MenuModule
  ],
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/">ALTEN Shop</a>
      </div>
      
      <nav class="nav-menu">
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
          <li *ngIf="isAuthenticated"><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
          <li *ngIf="isAdmin"><a routerLink="/admin" routerLinkActive="active">Admin</a></li>
        </ul>
      </nav>
      
      <div class="header-actions">
        <ng-container *ngIf="isAuthenticated; else loginButtons">
          <button 
            pButton 
            routerLink="/wishlist" 
            icon="pi pi-heart" 
            class="p-button-rounded p-button-outlined p-button-secondary mr-2"
          ></button>
          
          <span *ngIf="cartItemCount > 0" class="p-badge-wrapper">
            <button 
              pButton 
              routerLink="/cart" 
              icon="pi pi-shopping-cart" 
              class="p-button-rounded p-button-outlined mr-2"
            ></button>
            <span class="p-badge p-badge-danger">{{cartItemCount}}</span>
          </span>
          
          <button 
            *ngIf="cartItemCount === 0"
            pButton 
            routerLink="/cart" 
            icon="pi pi-shopping-cart" 
            class="p-button-rounded p-button-outlined mr-2"
          ></button>
          
          <button 
            pButton 
            icon="pi pi-user" 
            class="p-button-rounded p-button-outlined"
            (click)="menu.toggle($event)"
          ></button>
          
          <p-menu #menu [popup]="true" [model]="userMenuItems"></p-menu>
        </ng-container>
        
        <ng-template #loginButtons>
          <button 
            pButton 
            routerLink="/login" 
            label="Login" 
            class="p-button-outlined mr-2"
          ></button>
          
          <button 
            pButton 
            routerLink="/register" 
            label="Register" 
            class="p-button-outlined"
          ></button>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2196F3;
      text-decoration: none;
    }
    
    .nav-menu ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-menu li {
      margin-right: 1.5rem;
    }
    
    .nav-menu a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .nav-menu a:hover, .nav-menu a.active {
      color: #2196F3;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
    }
    
    .mr-2 {
      margin-right: 0.5rem;
    }
    
    /* Badge positioning styles */
    .p-badge-wrapper {
      position: relative;
      display: inline-block;
    }
    
    .p-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 0.75rem;
      border-radius: 50%;
      padding: 0.25rem 0.4rem;
      min-width: 1.5rem;
      height: 1.5rem;
      line-height: 1rem;
      text-align: center;
    }
    
    .p-badge-danger {
      background-color: #f44336;
      color: white;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
      }
      
      .nav-menu {
        margin: 1rem 0;
      }
      
      .nav-menu ul {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-menu li {
        margin: 0.5rem;
      }
      
      .header-actions {
        margin-top: 1rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  currentUser: User | null = null;
  cartItemCount = 0;
  userMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Watch authentication state
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.currentUser = this.authService.getCurrentUser();
        this.isAdmin = this.authService.isAdmin();
        this.setupUserMenu();
      }
    });

    // Watch cart updates
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  private setupUserMenu(): void {
    this.userMenuItems = [
      {
        label: this.currentUser?.username || 'User',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            routerLink: '/profile'
          },
          {
            label: 'My Orders',
            icon: 'pi pi-list',
            routerLink: '/orders'
          },
          {
            separator: true
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authService.logout();
            }
          }
        ]
      }
    ];
  }
}