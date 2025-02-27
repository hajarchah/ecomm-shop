import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Redirect to login page with return url
    return this.router.createUrlTree(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAdmin()) {
      return true;
    }
    
    // Redirect to home page if not admin
    return this.router.createUrlTree(['/']);
  }
}