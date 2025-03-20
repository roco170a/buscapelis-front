import React, { useEffect, useState } from 'react';
import { Genre } from '../interfaces/Genre';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../services/genreService';
import GenreForm from '../components/genres/GenreForm';
import Modal from '../components/modals/Modal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import '../styles/GenreCatalog.css';

const GenreCatalogPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // RCC States for the modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  
  // RCC States for the processing of actions
  const [processingAction, setProcessingAction] = useState<boolean>(false);

  useEffect(() => {
    fetchGenres();
  }, []);
  
  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGenres();
      
      if (response.success) {
        setGenres(response.data);
      } else {
        setError(response.message || 'Error al cargar los géneros');
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
    setSelectedGenre(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsFormModalOpen(true);
  };
  
  const handleOpenDeleteModal = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  
  // RCC Function to handle the creation or update of a genre
  const handleSaveGenre = async (genreData: any) => {
    try {
      setProcessingAction(true);
      
      if (selectedGenre) {
        // RCC We are updating an existing genre
        // RCC Include the ID in the data object for the update
        const updatedGenreData = {
          id: selectedGenre.id, // Important: include the ID in the object
          ...genreData
        };
        
        const response = await updateGenre(selectedGenre.id, updatedGenreData);
        
        if (response.success) {
          setSuccessMessage(`Género "${genreData.nombre}" actualizado correctamente`);
          // RCC Update the list of genres
          setGenres(genres.map(genre => 
            genre.id === selectedGenre.id ? { ...genre, ...genreData } : genre
          ));
        } else {
          setError(response.message || 'Error al actualizar el género');
        }
      } else {
        // RCC We are creating a new genre
        const response = await createGenre(genreData);
        
        if (response.success) {
          setSuccessMessage(`Género "${genreData.nombre}" creado correctamente`);
          // RCC Refresh the full list to get the new ID
          await fetchGenres();
        } else {
          setError(response.message || 'Error al crear el género');
        }
      }
      
      // RCC Close the modal after the operation
      setIsFormModalOpen(false);
    } catch (err) {
      setError('Error al procesar la operación');
      console.error(err);
    } finally {
      setProcessingAction(false);
    }
  };
  
  // RCC Function to delete a genre
  const handleDeleteGenre = async () => {
    if (!selectedGenre) return;
    
    try {
      setProcessingAction(true);
      
      const response = await deleteGenre(selectedGenre.id);
      
      if (response.success) {
        setSuccessMessage(`Género "${selectedGenre.nombre}" eliminado correctamente`);
        // RCC Delete the genre from the local list
        setGenres(genres.filter(genre => genre.id !== selectedGenre.id));
      } else {
        setError(response.message || 'Error al eliminar el género');
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

  if (loading && genres.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando catálogo de géneros...</p>
      </div>
    );
  }

  return (
    <div className="genre-catalog-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="genre-catalog-title">Catálogo de Géneros</h1>
          <button 
            className="btn btn-primary"
            onClick={handleOpenCreateModal}
            disabled={processingAction}
          >
            <i className="bi bi-plus"></i> Nuevo
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
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Cerrar"
            ></button>
          </div>
        )}

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
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Fecha de Creación</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.length > 0 ? (
                    genres.map(genre => (
                      <tr key={genre.id}>
                        <td>{genre.id}</td>
                        <td>{genre.nombre}</td>
                        <td>{new Date(genre.fechaCreacion).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleOpenEditModal(genre)}
                              disabled={processingAction}
                            >
                              <i className="bi bi-pencil"></i> Editar
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleOpenDeleteModal(genre)}
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
                      <td colSpan={4} className="text-center">
                        No hay géneros disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* RCC Modal to create/edit genre */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseModals}
      >
        <GenreForm 
          genre={selectedGenre}
          onSave={handleSaveGenre}
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
          message={`¿Está seguro que desea eliminar el género "${selectedGenre?.nombre}"?`}
          confirmText="Eliminar"
          onConfirm={handleDeleteGenre}
          onCancel={handleCloseModals}
        />
      </Modal>
    </div>
  );
};

export default GenreCatalogPage; 