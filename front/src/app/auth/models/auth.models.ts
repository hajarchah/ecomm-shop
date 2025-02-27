export interface User {
  id: number;
  username: string;
  firstname: string;
  email: string;
  isAdmin: boolean;
}

export interface RegisterRequest {
  username: string;
  firstname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}