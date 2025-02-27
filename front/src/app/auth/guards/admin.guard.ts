import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../data-access/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    // Redirect to home page
    this.router.navigate(['/']);
    return false;
  }
}