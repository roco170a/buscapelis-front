import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../interfaces/Auth';
import '../../styles/Login.css';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    userName: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Limpiar el error del campo cuando se modifica
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!credentials.userName.trim()) {
      errors.userName = 'El nombre de usuario es requerido';
    }
    
    if (!credentials.password) {
      errors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(credentials);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Iniciar Sesión</h1>
      
      {error && <div className="login-error">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName" className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            className={`form-control ${formErrors.userName ? 'is-invalid' : ''}`}
            id="userName"
            name="userName"
            value={credentials.userName}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            disabled={loading}
          />
          {formErrors.userName && <div className="invalid-feedback">{formErrors.userName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            disabled={loading}
          />
          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary login-button"
          disabled={loading}
        >
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="register-link">
        ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
      </div>
    </div>
  );
};

export default LoginForm; 