import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../interfaces/Movie';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../services/movieService';
import MovieForm from '../components/movies/MovieForm';
import Modal from '../components/modals/Modal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import '../styles/MovieCatalog.css';

const MovieCatalogPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | string[] | Record<string, any> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // RCC States for the modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // RCC States for the processing of actions
  const [processingAction, setProcessingAction] = useState<boolean>(false);

  useEffect(() => {
    fetchMovies();
  }, []);
  
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMovies();
      
      if (response.success) {
        setMovies(response.data);
      } else {
        setError(response.message || 'Error al cargar las películas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // RCC Handlers for CRUD actions
  const handleOpenCreateModal = () => {
    setSelectedMovie(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsFormModalOpen(true);
  };
  
  const handleOpenDeleteModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  
  // RCC Function to handle the creation or update of a movie
  const handleSaveMovie = async (movieData: any) => {
    try {
      setProcessingAction(true);
      setError(null);
      
      if (selectedMovie) {
        // RCC We are updating an existing movie
        // RCC Include the ID in the data object for the update
        const updatedMovieData = {
          id: selectedMovie.id, // Important: include the ID in the object
          ...movieData
        };
        
        const response = await updateMovie(selectedMovie.id, updatedMovieData);
        
        if (response.success) {
          setSuccessMessage(`Película "${movieData.titulo}" actualizada correctamente`);
          // RCC Update the list of movies
          setMovies(movies.map(movie => 
            movie.id === selectedMovie.id ? { ...movie, ...movieData } : movie
          ));
          // RCC Close the modal after a successful operation
          setIsFormModalOpen(false);
        } else {
          // RCC Handle different types of error responses
          if (response.errors) {            
            if (Array.isArray(response.errors)) {
              setError(response.errors);
            } else if (typeof response.errors === 'object') {
              setError(response.errors);
            } else {
              setError(response.message || 'Error desconocido al actualizar la película');
            }
          } else {
            setError(response.message || 'Error al actualizar la película');
          }
        }
      } else {
        // RCC We are creating a new movie
        const response = await createMovie(movieData);
        
        if (response.success) {
          setSuccessMessage(`Película "${movieData.titulo}" creada correctamente`);
          // RCC Refresh the full list to get the new ID
          await fetchMovies();
          // RCC Close the modal after a successful operation
          setIsFormModalOpen(false);
        } else {
          // RCC Handle different types of error responses
          if (response.errors) {
            if (Array.isArray(response.errors)) {
              setError(response.errors);
            } else if (typeof response.errors === 'object') {
              setError(response.errors);
            } else {
              setError(response.message || 'Error desconocido al crear la película');
            }
          } else {
            setError(response.message || 'Error al crear la película');
          }
        }
      }
    } catch (err: any) {
      console.error('Error en la operación de película:', err);
      setError(err.message || 'Error al procesar la operación');
    } finally {
      setProcessingAction(false);
    }
  };
  
  // RCC Function to delete a movie
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;
    
    try {
      setProcessingAction(true);
      
      const response = await deleteMovie(selectedMovie.id);
      
      if (response.success) {
        setSuccessMessage(`Película "${selectedMovie.titulo}" eliminada correctamente`);
        // RCC Delete the movie from the local list
        setMovies(movies.filter(movie => movie.id !== selectedMovie.id));
      } else {
        setError(response.message || 'Error al eliminar la película');
      }
      
      // RCC Close the modal after the operation
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Error al procesar la eliminación');
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };
  
  // RCC Clean success message after a time
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading && movies.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando catálogo de películas...</p>
      </div>
    );
  }

  return (
    <div className="movie-catalog-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="movie-catalog-title">Catálogo de Películas</h1>
          <button 
            className="btn btn-primary"
            onClick={handleOpenCreateModal}
            disabled={processingAction}
          >
            <i className="bi bi-plus"></i> Nueva Película
          </button>
        </div>
        
        {/* RCC Success or error messages */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccessMessage(null)}
              aria-label="Cerrar"
            ></button>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {typeof error === 'string' ? (
              <p className="mb-0"><strong>{error}</strong></p>
            ) : (
              <>
                <p className="mb-1"><strong>Se encontraron errores:</strong></p>
                <ul className="mb-0 ps-3">
                  {Array.isArray(error) 
                    ? error.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))
                    : Object.entries(error || {}).map(([key, value]) => (
                        <li key={key}>
                          {Array.isArray(value) 
                            ? `${key}: ${value.join(', ')}` 
                            : `${key}: ${value}`}
                        </li>
                      ))
                  }
                </ul>
              </>
            )}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Cerrar"
            ></button>
          </div>
        )}

        {/* RCC Card view for large screens */}
        <div className="d-none d-md-block">
          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Actualizando...</span>
              </div>
              <span className="ms-2">Actualizando datos...</span>
            </div>
          )}
          
          {movies.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {movies.map(movie => (
                <div className="col" key={movie.id}>
                  <div className="movie-card">
                    <div className="movie-poster">
                      <img 
                        src={movie.imagenUrl || '/placeholder-movie.png'} 
                        alt={movie.titulo}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-movie.png';
                        }}
                      />
                    </div>
                    <div className="movie-info">
                      <h5 className="movie-title">{movie.titulo}</h5>
                      <div className="movie-year">{movie.anio}</div>
                      
                      {movie.generos && movie.generos.length > 0 && (
                        <div className="movie-genres">
                          {movie.generos.slice(0, 3).map(genre => (
                            <span key={genre.generoId} className="movie-genre">
                              {genre.nombreGenero}
                            </span>
                          ))}
                          {movie.generos.length > 3 && (
                            <span className="movie-genre">+{movie.generos.length - 3}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="d-flex gap-2 mt-2">
                        <Link 
                          to={`/pelicula/${movie.id}`} 
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                        >
                          <i className="bi bi-eye"></i> Ver
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-success flex-grow-1"
                          onClick={() => handleOpenEditModal(movie)}
                          disabled={processingAction}
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          onClick={() => handleOpenDeleteModal(movie)}
                          disabled={processingAction}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No hay películas disponibles. ¡Agrega una nueva película!
            </div>
          )}
        </div>
        
        {/* RCC Table view for small screens */}
        <div className="d-md-none">
          <div className="card">
            <div className="card-body">
              {loading && (
                <div className="text-center my-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Actualizando...</span>
                  </div>
                  <span className="ms-2">Actualizando datos...</span>
                </div>
              )}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Año</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.length > 0 ? (
                      movies.map(movie => (
                        <tr key={movie.id}>
                          <td>{movie.titulo}</td>
                          <td>{movie.anio}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link 
                                to={`/pelicula/${movie.id}`}
                                className="btn btn-primary btn-sm"
                              >
                                <i className="bi bi-eye"></i> Ver
                              </Link>
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleOpenEditModal(movie)}
                                disabled={processingAction}
                              >
                                <i className="bi bi-pencil"></i> Editar
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleOpenDeleteModal(movie)}
                                disabled={processingAction}
                              >
                                <i className="bi bi-trash"></i> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
                          No hay películas disponibles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* RCC Modal to create/edit movie */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseModals}
        size="lg"
      >
        <MovieForm 
          movie={selectedMovie}
          onSave={handleSaveMovie}
          onCancel={handleCloseModals}
        />
      </Modal>
      
      {/* RCC Confirmation modal to delete */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseModals}
        size="sm"
      >
        <ConfirmationModal 
          title="Confirmar eliminación"
          message={`¿Está seguro que desea eliminar la película "${selectedMovie?.titulo}"?`}
          confirmText="Eliminar"
          onConfirm={handleDeleteMovie}
          onCancel={handleCloseModals}
        />
      </Modal>
    </div>
  );
};

export default MovieCatalogPage; 