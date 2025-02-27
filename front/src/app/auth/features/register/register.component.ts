import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-register',
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
    <div class="register-container">
      <p-toast></p-toast>
      <p-card class="register-card">
        <ng-template pTemplate="title">
          <h2 class="text-center">Register</h2>
        </ng-template>
        <ng-template pTemplate="content">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label for="username">Username</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-user"></i>
                <input 
                  id="username" 
                  type="text" 
                  pInputText 
                  formControlName="username" 
                  placeholder="Username" 
                  class="w-full"
                  [ngClass]="{'ng-invalid ng-dirty': submitted && f['username'].errors}"
                />
              </span>
              <small *ngIf="submitted && f['username'].errors" class="p-error">
                <span *ngIf="f['username'].errors['required']">Username is required</span>
                <span *ngIf="f['username'].errors['minlength']">Username must be at least 3 characters</span>
              </small>
            </div>
            
            <div class="field">
              <label for="firstname">First Name</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-id-card"></i>
                <input 
                  id="firstname" 
                  type="text" 
                  pInputText 
                  formControlName="firstname" 
                  placeholder="First name" 
                  class="w-full"
                  [ngClass]="{'ng-invalid ng-dirty': submitted && f['firstname'].errors}"
                />
              </span>
              <small *ngIf="submitted && f['firstname'].errors?.['required']" class="p-error">
                First name is required
              </small>
            </div>
            
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
                [toggleMask]="true"
                placeholder="Password"
                styleClass="w-full"
                [ngClass]="{'ng-invalid ng-dirty': submitted && f['password'].errors}"
              ></p-password>
              <small *ngIf="submitted && f['password'].errors" class="p-error">
                <span *ngIf="f['password'].errors['required']">Password is required</span>
                <span *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</span>
              </small>
            </div>
            
            <div class="field">
              <label for="confirmPassword">Confirm Password</label>
              <p-password 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                [feedback]="false"
                [toggleMask]="true"
                placeholder="Confirm password"
                styleClass="w-full"
                [ngClass]="{'ng-invalid ng-dirty': submitted && f['confirmPassword'].errors}"
              ></p-password>
              <small *ngIf="submitted && f['confirmPassword'].errors" class="p-error">
                <span *ngIf="f['confirmPassword'].errors['required']">Confirm password is required</span>
                <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</span>
              </small>
            </div>
            
            <div class="flex flex-column gap-2 mt-4">
              <button 
                pButton 
                type="submit" 
                label="Register" 
                icon="pi pi-user-plus" 
                class="p-button-primary"
                [loading]="loading"
              ></button>
              <p class="text-center mt-3">
                Already have an account? <a routerLink="/auth/login">Login</a>
              </p>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 4rem);
      padding: 2rem;
      background-color: var(--surface-ground);
    }
    
    .register-card {
      width: 100%;
      max-width: 500px;
    }
    
    .field {
      margin-bottom: 1.5rem;
    }

    .p-password {
      width: 100%;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
    
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get f() { return this.registerForm.controls; }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;
    
    this.authService.register(userData)
      .subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success',
            summary: 'Success',
            detail: 'Registration successful! Please login.'
          });
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: error => {
          this.messageService.add({ 
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Registration failed. Please try again.'
          });
          this.loading = false;
        }
      });
  }
}