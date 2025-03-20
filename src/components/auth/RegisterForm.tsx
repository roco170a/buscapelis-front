import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest } from '../../interfaces/Auth';
import '../../styles/Login.css';

const RegisterForm: React.FC = () => {
  const [userData, setUserData] = useState<RegisterRequest>({
    nombre: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    // Limpiar el error del campo cuando se modifica
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!userData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!userData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'El formato del email no es válido';
    }
    
    if (!userData.userName.trim()) {
      errors.userName = 'El nombre de usuario es requerido';
    }
    
    if (!userData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (userData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!userData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await register(userData);    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Registro</h1>
      
      {error && <div className="login-error">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            disabled={loading}
          />
          {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Ingresa tu email"
            disabled={loading}
          />
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="userName" className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            className={`form-control ${formErrors.userName ? 'is-invalid' : ''}`}
            id="userName"
            name="userName"
            value={userData.userName}
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
            value={userData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            disabled={loading}
          />
          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirma tu contraseña"
            disabled={loading}
          />
          {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary login-button"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <div className="register-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

export default RegisterForm; 