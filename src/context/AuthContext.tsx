import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getUserFromLocalStorage, 
  removeUserFromLocalStorage, 
  saveUserToLocalStorage, 
  login as loginService,
  register as registerService
} from '../services/authService';
import { LoginRequest, RegisterRequest, User } from '../interfaces/Auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = getUserFromLocalStorage();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginService(credentials);
      
      if (response.success) {
        const userData = response.data;
        
          
        // RCC Extract role from JWT token
        const tokenPayload = JSON.parse(atob(userData.token.split('.')[1]));
        const userWithRole: User = {
          ...userData,
          role: tokenPayload.role
        };
        
        setUser(userWithRole);
        saveUserToLocalStorage(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        setError(response.message || response.errors?.[0] || 'Error de inicio de sesión');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setError('Error de conexión con el servidor');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerService(userData);
      
      if (response.success) {
        // RCC After registration, we typically don't log in automatically
        // RCC but we could do it if desired
        setLoading(false);
        return true;
      } else {        
        setError(response.message || response.errors?.[0] || 'Error de registro');
        // RCC If there are additional errors, show the first one
        if (response.errors?.length > 0) {
          setError(response.errors[0]);
        }
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setError('Error de conexión con el servidor');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    removeUserFromLocalStorage();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 