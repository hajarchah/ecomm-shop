import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  // Load stored authentication data on service initialization
  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);
    
    if (token && storedUser) {
      const user = JSON.parse(storedUser) as User;
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Register a new user - FIXED
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.storeAuthData(response))
      );
  }

  // Login user - FIXED
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.storeAuthData(response))
      );
  }

  // Store authentication data
  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/login']);
  }

  // Check if user is admin
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return !!currentUser?.isAdmin;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}