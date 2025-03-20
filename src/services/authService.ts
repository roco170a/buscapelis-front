import { LoginRequest, RegisterRequest, AuthResponse, UserData } from '../interfaces/Auth';

// RCC Define the base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/Usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: {} as UserData,
      errors: ['Error de conexión con el servidor']
    };
  }
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/Usuarios/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en registro:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: {} as UserData,
      errors: ['Error de conexión con el servidor']
    };
  }
};

export const saveUserToLocalStorage = (userData: UserData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
};

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
}; 