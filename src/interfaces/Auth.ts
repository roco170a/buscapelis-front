export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: UserData;
  errors: string[];
}

export interface UserData {
  id: string;
  userName: string;
  nombre: string;
  email: string;
  token: string;
}

export interface User {
  id: string;
  userName: string;
  nombre: string;
  email: string;
  role: string;
} 