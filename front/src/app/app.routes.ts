import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/data-access/auth.service';

const authGuard = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return new AuthGuard(authService, router).canActivate();
};

const adminGuard = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return new AdminGuard(authService, router).canActivate();
};

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('../app/shared/features/home/home.component').then(c => c.HomeComponent) 
  },
  { 
    path: 'products', 
    loadComponent: () => import('../app/products/features/product-list/product-list.component').then(c => c.ProductListComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('../app/contact/features/contact-page/contact-page.component').then(c => c.ContactPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('../app/cart/features/cart-view/cart-view.component').then(c => c.CartViewComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'wishlist', 
    loadComponent: () => import('./wishlist/features/wishlist-page/wishlist-page.component').then(c => c.WishlistPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/features/login/login.component').then(c => c.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/features/register/register.component').then(c => c.RegisterComponent) 
  },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];
