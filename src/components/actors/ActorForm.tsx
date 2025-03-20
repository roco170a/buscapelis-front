import React, { useState, useEffect } from 'react';
import { Actor } from '../../interfaces/Actor';

interface ActorFormProps {
  actor?: Actor | null;
  onSave: (actorData: any) => void;
  onCancel: () => void;
}

const ActorForm: React.FC<ActorFormProps> = ({ actor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    biografia: '',
    fotoUrl: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [previewing, setPreviewing] = useState(false);
  
  useEffect(() => {
    if (actor) {
      // Si existe un actor, configuramos los datos del formulario
      setFormData({
        nombre: actor.nombre || '',
        biografia: actor.biografia || '',
        fotoUrl: actor.fotoUrl || ''
      });
      
      // Si tiene una URL de foto, activamos la vista previa
      if (actor.fotoUrl) {
        setPreviewing(true);
      }
    } else {
      // Si estamos creando un nuevo actor, reseteamos el formulario
      setFormData({
        nombre: '',
        biografia: '',
        fotoUrl: ''
      });
      setPreviewing(false);
    }
  }, [actor]);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (formData.biografia && formData.biografia.length > 500) {
      newErrors.biografia = 'La biografía no puede exceder los 500 caracteres';
    }
    
    if (formData.fotoUrl && !isValidUrl(formData.fotoUrl)) {
      newErrors.fotoUrl = 'La URL de la foto no es válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    // Si es la URL de la foto y no está vacía, intentamos previsualizar
    if (name === 'fotoUrl') {
      setPreviewing(value.trim() !== '');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Si estamos editando, asegurarse de que estamos incluyendo
      // todos los datos originales que no modificamos
      if (actor) {
        // Conservar el ID original para evitar errores de validación en el backend
        onSave({
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
        <h5 className="modal-title">{actor ? 'Editar' : 'Agregar'} Actor</h5>
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
              placeholder="Nombre completo del actor"
              required
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="biografia" className="form-label">Biografía</label>
            <textarea
              className={`form-control ${errors.biografia ? 'is-invalid' : ''}`}
              id="biografia"
              name="biografia"
              rows={3}
              value={formData.biografia}
              onChange={handleChange}
              placeholder="Biografía del actor (máximo 500 caracteres)"
            ></textarea>
            {errors.biografia && <div className="invalid-feedback">{errors.biografia}</div>}
            <small className="text-muted">
              {formData.biografia ? formData.biografia.length : 0}/500 caracteres
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="fotoUrl" className="form-label">URL de la Foto</label>
            <input
              type="text"
              className={`form-control ${errors.fotoUrl ? 'is-invalid' : ''}`}
              id="fotoUrl"
              name="fotoUrl"
              value={formData.fotoUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/foto.jpg"
            />
            {errors.fotoUrl && <div className="invalid-feedback">{errors.fotoUrl}</div>}
            {previewing && formData.fotoUrl && (
              <div className="mt-2">
                <p className="mb-1"><small>Vista previa:</small></p>
                <img 
                  src={formData.fotoUrl} 
                  alt="Vista previa" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '100px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    if (!errors.fotoUrl) {
                      setErrors({
                        ...errors,
                        fotoUrl: 'No se pudo cargar la imagen. Verifica la URL.'
                      });
                    }
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = 'block';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {actor ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActorForm; 