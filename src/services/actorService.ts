import apiClient from '../utils/api';
import { ActorResponse } from '../interfaces/Actor';

export const getActors = async () => {
  try {
    const response = await apiClient.get<ActorResponse>('/Actores');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching actors:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener los actores',
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const getActorById = async (id: number) => {
  try {
    const response = await apiClient.get<ActorResponse>(`/Actores/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching actor with id ${id}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || `Error al obtener el actor con ID ${id}`,
      data: null,
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const createActor = async (actorData: any) => {
  try {
    
    const response = await apiClient.post<ActorResponse>('/Actores', actorData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating actor:', error);
    console.error('Response data:', error.response?.data);
    
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = 'Error al crear el actor';

    // RCC If 401 add unauthorized message
    if (error.status === 401) {
      errorMessages = ['No tienes permisos para realizar esta acción, favor de iniciar sesión'];
      errorMessage = 'No tienes permisos para realizar esta acción, favor de iniciar sesión';
    }
    
    return {
      success: false,
      message: errorMessage,
      data: null,
      errors: errorMessages
    };
  }
};

export const updateActor = async (id: number, actorData: any) => {
  try {

    const response = await apiClient.put<ActorResponse>(`/Actores/${id}`, actorData);
    return response.data;
  } catch (error: any) {
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al actualizar el actor con ID ${id}`;

    console.error(`Error updating actor with id ${id}:`, error);
    console.error('Response data:', error.response?.data);
    
    // RCC If 401 add unauthorized message
    if (error.status === 401) {
      errorMessages = ['No tienes permisos para realizar esta acción, favor de iniciar sesión'];
      errorMessage = 'No tienes permisos para realizar esta acción, favor de iniciar sesión';
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
      errors: errorMessages
    };
  }
};

export const deleteActor = async (id: number) => {
  try {
    const response = await apiClient.delete<ActorResponse>(`/Actores/${id}`);
    return response.data;
  } catch (error: any) {
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al eliminar el actor con ID ${id}`;

    console.error(`Error deleting actor with id ${id}:`, error);

    // RCC If 401 add unauthorized message
    if (error.status === 401) {
      errorMessages = ['No tienes permisos para realizar esta acción, favor de iniciar sesión'];
      errorMessage = 'No tienes permisos para realizar esta acción, favor de iniciar sesión';
    }
    
    return {
      success: false,
      message: errorMessage,
      data: null,
      errors: errorMessages
    };
  }
}; 