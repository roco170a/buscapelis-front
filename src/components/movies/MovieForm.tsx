import React, { useState, useEffect } from 'react';
import { Movie } from '../../interfaces/Movie';
import { getGenres } from '../../services/genreService';
import { getActors } from '../../services/actorService';

interface MovieFormProps {
  movie?: Movie | null;
  onSave: (movieData: any) => void;
  onCancel: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    sinopsis: '',
    anio: new Date().getFullYear(),
    imagenUrl: '',
    generos: [] as number[],
    actores: [] as { actorId: number, nombreActor?: string, personaje: string }[]
  });
  
  const [allGenres, setAllGenres] = useState<any[]>([]);
  const [allActors, setAllActors] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [previewing, setPreviewing] = useState(false);
  const [newActor, setNewActor] = useState({ actorId: 0, personaje: '' });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Cargar géneros
        const genresResponse = await getGenres();
        if (genresResponse.success) {
          setAllGenres(genresResponse.data);
        }
        
        // Cargar actores
        const actorsResponse = await getActors();
        if (actorsResponse.success) {
          setAllActors(actorsResponse.data);
        }
      } catch (error) {
        console.error('Error cargando datos para el formulario:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    if (movie) {
      // Si existe una película, configuramos los datos del formulario
      setFormData({
        titulo: movie.titulo || '',
        sinopsis: movie.sinopsis || '',
        anio: movie.anio || new Date().getFullYear(),
        imagenUrl: movie.imagenUrl || '',
        generos: movie.generos ? movie.generos.map(g => g.generoId) : [],
        actores: movie.actores ? movie.actores.map(a => ({ 
          actorId: a.actorId, 
          nombreActor: a.nombreActor,
          personaje: a.personaje 
        })) : []
      });
      
      // Si tiene una URL de imagen, activamos la vista previa
      if (movie.imagenUrl) {
        setPreviewing(true);
      }
    } else {
      // Si estamos creando una nueva película, reseteamos el formulario
      setFormData({
        titulo: '',
        sinopsis: '',
        anio: new Date().getFullYear(),
        imagenUrl: '',
        generos: [],
        actores: []
      });
      setPreviewing(false);
    }
  }, [movie]);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 2) {
      newErrors.titulo = 'El título debe tener al menos 2 caracteres';
    }
    
    if (!formData.sinopsis.trim()) {
      newErrors.sinopsis = 'La sinopsis es obligatoria';
    } else if (formData.sinopsis.trim().length < 10) {
      newErrors.sinopsis = 'La sinopsis debe tener al menos 10 caracteres';
    }
    
    if (!formData.anio) {
      newErrors.anio = 'El año es obligatorio';
    } else if (formData.anio < 1895 || formData.anio > new Date().getFullYear() + 5) {
      newErrors.anio = `El año debe estar entre 1895 y ${new Date().getFullYear() + 5}`;
    }
    
    if (formData.imagenUrl && !isValidUrl(formData.imagenUrl)) {
      newErrors.imagenUrl = 'La URL de la imagen no es válida';
    }
    
    if (formData.generos.length === 0) {
      newErrors.generos = 'Debe seleccionar al menos un género';
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'anio') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || new Date().getFullYear()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Limpiar el error cuando se modifica el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Si es la URL de la imagen y no está vacía, intentamos previsualizar
    if (name === 'imagenUrl') {
      setPreviewing(value.trim() !== '');
    }
  };
  
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({
      ...formData,
      generos: selectedOptions
    });
    
    if (errors.generos) {
      setErrors({
        ...errors,
        generos: ''
      });
    }
  };
  
  const handleActorChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActor({
      ...newActor,
      [name]: name === 'actorId' ? parseInt(value) : value
    });
  };
  
  const handleAddActor = () => {
    if (newActor.actorId && newActor.personaje.trim()) {
      // Verificar si ya existe este actor
      const actorExists = formData.actores.some(a => a.actorId === newActor.actorId);
      
      if (!actorExists) {
        // Obtener datos completos del actor seleccionado
        const actorData = allActors.find(a => a.id === newActor.actorId);
        console.log('Actor seleccionado:', actorData);
        
        // Crear el nuevo actor con estructura completa
        const nuevoActor = { 
          actorId: newActor.actorId,
          personaje: newActor.personaje.trim(),
          // Agregar el nombreActor aquí también para tenerlo desde el principio
          nombreActor: actorData?.nombre || 'Actor desconocido'
        };
        
        // Añadir actor con todos los datos necesarios
        const updatedActores = [...formData.actores, nuevoActor];
        
        console.log('Actores actuales:', formData.actores);
        console.log('Lista actualizada de actores:', updatedActores);
        
        // Actualizar todo el estado formData con los nuevos actores
        setFormData(prevState => ({
          ...prevState,
          actores: [...prevState.actores, nuevoActor]
        }));
        
        // Resetear el formulario de actor
        setNewActor({ actorId: 0, personaje: '' });
      }
    }
  };
  
  const handleRemoveActor = (actorId: number) => {
    setFormData({
      ...formData,
      actores: formData.actores.filter(a => a.actorId !== actorId)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORMULARIO AL ENVIAR ===');
    console.log('formData completo:', formData);
    console.log('Actores en formData:', formData.actores);
    
    if (validateForm()) {
      // Asegurarse de que los actores tienen la estructura correcta
      // y evitar la mutación del estado original
      const actoresFormatted = formData.actores.map(actor => {
        const actorData = allActors.find(a => a.id === actor.actorId);
        return {
          actorId: actor.actorId,
          nombreActor: actor.nombreActor || actorData?.nombre || 'Actor desconocido',
          personaje: actor.personaje || 'Personaje sin especificar'
        };
      });
      
      console.log('Actores formateados:', actoresFormatted);
      
      // Preparar objeto con formato correcto para API
      const movieData = {
        ...formData,
        // Convertir géneros al formato requerido por la API, incluyendo nombreGenero
        generos: formData.generos.map(id => {
          const genreData = allGenres.find(g => g.id === id);
          return { 
            generoId: id,
            nombreGenero: genreData?.nombre || 'Género desconocido' // Incluir el nombre del género
          };
        }),
        // Usar los actores ya formateados
        actores: actoresFormatted
      };
      
      console.log('=== DATOS FINALES A ENVIAR ===');
      console.log('Enviando datos de película:', movieData);
      console.log('Datos de actores enviados:', JSON.stringify(movieData.actores, null, 2));
      console.log('============================');
      
      // Si estamos editando, incluir el ID
      if (movie) {
        onSave({
          id: movie.id,
          ...movieData
        });
      } else {
        onSave(movieData);
      }
    }
  };
  
  if (loadingData) {
    return (
      <div className="modal-content">
        <div className="modal-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{movie ? 'Editar' : 'Agregar'} Película</h5>
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
            <label htmlFor="titulo" className="form-label">Título <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título de la película"
              required
            />
            {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="sinopsis" className="form-label">Sinopsis <span className="text-danger">*</span></label>
            <textarea
              className={`form-control ${errors.sinopsis ? 'is-invalid' : ''}`}
              id="sinopsis"
              name="sinopsis"
              rows={3}
              value={formData.sinopsis}
              onChange={handleChange}
              placeholder="Sinopsis de la película"
              required
            ></textarea>
            {errors.sinopsis && <div className="invalid-feedback">{errors.sinopsis}</div>}
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="anio" className="form-label">Año <span className="text-danger">*</span></label>
              <input
                type="number"
                className={`form-control ${errors.anio ? 'is-invalid' : ''}`}
                id="anio"
                name="anio"
                min="1895"
                max={new Date().getFullYear() + 5}
                value={formData.anio}
                onChange={handleChange}
                required
              />
              {errors.anio && <div className="invalid-feedback">{errors.anio}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="imagenUrl" className="form-label">URL de la Imagen</label>
              <input
                type="text"
                className={`form-control ${errors.imagenUrl ? 'is-invalid' : ''}`}
                id="imagenUrl"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.imagenUrl && <div className="invalid-feedback">{errors.imagenUrl}</div>}
            </div>
          </div>
          
          {previewing && formData.imagenUrl && (
            <div className="mb-3">
              <p className="mb-1"><small>Vista previa:</small></p>
              <img 
                src={formData.imagenUrl} 
                alt="Vista previa" 
                className="img-thumbnail" 
                style={{ maxHeight: '150px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  if (!errors.imagenUrl) {
                    setErrors({
                      ...errors,
                      imagenUrl: 'No se pudo cargar la imagen. Verifica la URL.'
                    });
                  }
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = 'block';
                }}
              />
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="generos" className="form-label">Géneros <span className="text-danger">*</span></label>
            <select
              multiple
              className={`form-select ${errors.generos ? 'is-invalid' : ''}`}
              id="generos"
              value={formData.generos.map(g => g.toString())}
              onChange={handleGenreChange}
              size={Math.min(5, allGenres.length)}
              required
            >
              {allGenres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.nombre}
                </option>
              ))}
            </select>
            {errors.generos && <div className="invalid-feedback">{errors.generos}</div>}
            <small className="text-muted">Mantén presionado Ctrl (Cmd en Mac) para seleccionar varios géneros.</small>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Actores</label>
            
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label htmlFor="actorId" className="form-label">Actor</label>
                    <select
                      className="form-select"
                      id="actorId"
                      name="actorId"
                      value={newActor.actorId}
                      onChange={handleActorChange}
                    >
                      <option value="">Selecciona un actor</option>
                      {allActors
                        .filter(actor => !formData.actores.some(a => a.actorId === actor.id))
                        .map(actor => (
                          <option key={actor.id} value={actor.id}>
                            {actor.nombre}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="personaje" className="form-label">Personaje</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="personaje"
                        name="personaje"
                        value={newActor.personaje}
                        onChange={handleActorChange}
                        placeholder="Nombre del personaje"
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleAddActor}
                        disabled={!newActor.actorId || !newActor.personaje.trim()}
                      >
                        <i className="bi bi-plus"></i> Añadir actor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {formData.actores.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>Actor</th>
                      <th>Personaje</th>
                      <th style={{ width: '50px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.actores.map(actor => {
                      const actorData = allActors.find(a => a.id === actor.actorId);
                      return (
                        <tr key={actor.actorId}>
                          <td>{actorData ? actorData.nombre : `Actor ID: ${actor.actorId}`}</td>
                          <td>{actor.personaje}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveActor(actor.actorId)}
                            >
                              <i className="bi bi-trash"></i> Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning">
                No hay actores añadidos a esta película.
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {movie ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm; 