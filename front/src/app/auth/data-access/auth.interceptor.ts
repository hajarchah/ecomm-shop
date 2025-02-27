import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token
    const token = this.authService.getToken();
    
    // Skip adding token for authentication endpoints
    if (request.url.includes('/token') || request.url.includes('/account')) {
      return next.handle(request);
    }
    
    // Add token to headers for authenticated requests
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle response and check for 401 (Unauthorized)
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, log out and redirect to login
          this.authService.logout();
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: this.router.url }
          });
        }
        return throwError(() => error);
      })
    );
  }
}