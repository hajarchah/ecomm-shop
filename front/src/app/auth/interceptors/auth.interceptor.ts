import { Injectable } from "@angular/core";
import {
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../data-access/auth.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add auth token to requests
    const token = this.authService.getToken();

    // Skip adding token for authentication endpoints
    if (request.url.includes("/token") || request.url.includes("/account")) {
      return next.handle(request);
    }

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["/login"]);
        }
        return throwError(() => error);
      })
    );
  }
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Only add auth token to API requests
  if (req.url.startsWith(environment.apiUrl)) {
    const token = authService.getToken();

    // Skip adding token for login/register endpoints
    if (
      token &&
      !req.url.includes("/token") &&
      !req.url.includes("/register")
    ) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req);
};
