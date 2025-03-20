import React, { useEffect, useState } from 'react';
import { Actor } from '../interfaces/Actor';
import { getActors, createActor, updateActor, deleteActor } from '../services/actorService';
import ActorForm from '../components/actors/ActorForm';
import Modal from '../components/modals/Modal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import '../styles/ActorCatalog.css';

const ActorCatalogPage: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para los modales
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  
  // Estados para control de operaciones
  const [processingAction, setProcessingAction] = useState<boolean>(false);

  useEffect(() => {
    fetchActors();
  }, []);
  
  const fetchActors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActors();
      
      if (response.success) {
        setActors(response.data);
      } else {
        setError(response.message || 'Error al cargar los actores');
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
    setSelectedActor(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (actor: Actor) => {
    setSelectedActor(actor);
    setIsFormModalOpen(true);
  };
  
  const handleOpenDeleteModal = (actor: Actor) => {
    setSelectedActor(actor);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  
  // RCC Function to handle the creation or update of an actor
  const handleSaveActor = async (actorData: any) => {
    try {
      setProcessingAction(true);
      
      if (selectedActor) {
        // RCC We are updating an existing actor
        // RCC Include the ID in the data object for the update
        const updatedActorData = {
          id: selectedActor.id, // Important: include the ID in the object
          ...actorData
        };
        
        const response = await updateActor(selectedActor.id, updatedActorData);
        
        if (response.success) {
          setSuccessMessage(`Actor "${actorData.nombre}" actualizado correctamente`);
          // RCC Update the list of actors
          setActors(actors.map(actor => 
            actor.id === selectedActor.id ? { ...actor, ...actorData } : actor
          ));
        } else {
          setError(response.message || 'Error al actualizar el actor');
        }
      } else {
        // RCC We are creating a new actor
        const response = await createActor(actorData);
        
        if (response.success) {
          setSuccessMessage(`Actor "${actorData.nombre}" creado correctamente`);
          // RCC Refresh the full list to get the new ID
          await fetchActors();
        } else {
          setError(response.message || 'Error al crear el actor');
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
  
  // RCC Function to delete an actor
  const handleDeleteActor = async () => {
    if (!selectedActor) return;
    
    try {
      setProcessingAction(true);
      
      const response = await deleteActor(selectedActor.id);
      
      if (response.success) {
        setSuccessMessage(`Actor "${selectedActor.nombre}" eliminado correctamente`);
        // RCC Delete the actor from the local list
        setActors(actors.filter(actor => actor.id !== selectedActor.id));
      } else {
        setError(response.message || 'Error al eliminar el actor');
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

  if (loading && actors.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando catálogo de actores...</p>
      </div>
    );
  }

  return (
    <div className="actor-catalog-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="actor-catalog-title">Catálogo de Actores</h1>
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
                    <th>Apellido</th>
                    <th>Biografía</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {actors.length > 0 ? (
                    actors.map(actor => {
                      // Separar el nombre completo en nombre y apellido
                      const nameParts = actor.nombre.split(' ');
                      const firstName = nameParts[0] || '';
                      const lastName = nameParts.slice(1).join(' ') || '';
                      
                      return (
                        <tr key={actor.id}>
                          <td>{actor.id}</td>
                          <td>{firstName}</td>
                          <td>{lastName}</td>
                          <td>{actor.biografia ? actor.biografia.substring(0, 30) + '...' : 'Sin biografía'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleOpenEditModal(actor)}
                                disabled={processingAction}
                              >
                                <i className="bi bi-pencil"></i> Editar
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleOpenDeleteModal(actor)}
                                disabled={processingAction}
                              >
                                <i className="bi bi-trash"></i> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No hay actores disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* RCC Modal to create/edit actor */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseModals}
      >
        <ActorForm 
          actor={selectedActor}
          onSave={handleSaveActor}
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
          message={`¿Está seguro que desea eliminar al actor "${selectedActor?.nombre}"?`}
          confirmText="Eliminar"
          onConfirm={handleDeleteActor}
          onCancel={handleCloseModals}
        />
      </Modal>
    </div>
  );
};

export default ActorCatalogPage; 