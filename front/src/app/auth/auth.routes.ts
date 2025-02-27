import { Route } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';

export const AUTH_ROUTES: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];