import React, { useState, useEffect } from 'react';
import { Genre } from '../../interfaces/Genre';

interface GenreFormProps {
  genre?: Genre | null;
  onSave: (genreData: any) => void;
  onCancel: () => void;
}

const GenreForm: React.FC<GenreFormProps> = ({ genre, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    if (genre) {
      // Si existe un género, configuramos los datos del formulario
      setFormData({
        nombre: genre.nombre || ''
      });
    } else {
      // Si estamos creando un nuevo género, reseteamos el formulario
      setFormData({
        nombre: ''
      });
    }
  }, [genre]);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del género es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar el error cuando se modifica el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si estamos editando, asegurarse de que estamos incluyendo
      // todos los datos originales que no modificamos
      if (genre) {
        // Conservar el ID original para evitar errores de validación en el backend
        onSave({
          id: genre.id,
          ...formData
        });
      } else {
        onSave(formData);
      }
    }
  };
  
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{genre ? 'Editar' : 'Agregar'} Género</h5>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onCancel}
          aria-label="Cerrar"
        ></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del género"
              required
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {genre ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenreForm; 