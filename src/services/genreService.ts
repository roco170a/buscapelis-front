import apiClient from '../utils/api';
import { GenreResponse } from '../interfaces/Genre';

export const getGenres = async () => {
  try {
    const response = await apiClient.get<GenreResponse>('/Generos');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching genres:', error);
    
    // RCC Create a formatted error response
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener los géneros',
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const getGenreById = async (id: number) => {
  try {
    const response = await apiClient.get<GenreResponse>(`/Generos/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching genre with id ${id}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || `Error al obtener el género con ID ${id}`,
      data: null,
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const createGenre = async (genreData: any) => {
  try {
    const response = await apiClient.post<GenreResponse>('/Generos', genreData);
    return response.data;
  } catch (error: any) {
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = 'Error al crear el género';

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

export const updateGenre = async (id: number, genreData: any) => {
  try {
    const response = await apiClient.put<GenreResponse>(`/Generos/${id}`, genreData);
    return response.data;
  } catch (error: any) {
    
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al actualizar el género con ID ${id}`;

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

export const deleteGenre = async (id: number) => {
  try {
    const response = await apiClient.delete<GenreResponse>(`/Generos/${id}`);
    return response.data;
  } catch (error: any) {
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al eliminar el género con ID ${id}`;

    console.error(`Error deleting genre with id ${id}:`, error);

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