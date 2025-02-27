import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../data-access/auth.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
    MessagesModule,
    ToastModule,
    RouterLink
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <p-toast></p-toast>
      <p-card class="login-card">
        <ng-template pTemplate="title">
          <h2 class="text-center">Login</h2>
        </ng-template>
        <ng-template pTemplate="content">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label for="email">Email</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope"></i>
                <input 
                  id="email" 
                  type="text" 
                  pInputText 
                  formControlName="email" 
                  placeholder="Email address" 
                  class="w-full"
                  [ngClass]="{'ng-invalid ng-dirty': submitted && f['email'].errors}"
                />
              </span>
              <small *ngIf="submitted && f['email'].errors" class="p-error">
                <span *ngIf="f['email'].errors['required']">Email is required</span>
                <span *ngIf="f['email'].errors['email']">Email must be a valid address</span>
              </small>
            </div>
            
            <div class="field">
              <label for="password">Password</label>
              <p-password 
                id="password" 
                formControlName="password" 
                [feedback]="false" 
                [toggleMask]="true"
                placeholder="Password"
                styleClass="w-full"
                [ngClass]="{'ng-invalid ng-dirty': submitted && f['password'].errors}"
              ></p-password>
              <small *ngIf="submitted && f['password'].errors?.['required']" class="p-error">
                Password is required
              </small>
            </div>
            
            <div class="flex flex-column gap-2 mt-4">
              <button 
                pButton 
                type="submit" 
                label="Login" 
                icon="pi pi-sign-in" 
                class="p-button-primary"
                [loading]="loading"
              ></button>
              <p class="text-center mt-3">
                Don't have an account? <a routerLink="/auth/register">Register</a>
              </p>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 4rem);
      padding: 2rem;
      background-color: var(--surface-ground);
    }
    
    .login-card {
      width: 100%;
      max-width: 450px;
    }
    
    .field {
      margin-bottom: 1.5rem;
    }

    .p-password {
      width: 100%;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully logged in'
          });
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        error: error => {
          this.messageService.add({ 
            severity: 'error',
            summary: 'Error',
            detail: 'Login failed. Please check your credentials.'
          });
          this.loading = false;
        }
      });
  }
}