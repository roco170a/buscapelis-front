import apiClient from '../utils/api';
import { MovieResponse, SingleMovieResponse } from '../interfaces/Movie';

export const getMovies = async () => {
  try {
    const response = await apiClient.get<MovieResponse>('/Peliculas');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching movies:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener las películas',
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const getMovieById = async (id: number) => {
  try {
    const response = await apiClient.get<SingleMovieResponse>(`/Peliculas/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching movie with id ${id}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || `Error al obtener la película con ID ${id}`,
      data: null,
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const searchMovies = async (searchTerm: string) => {
  try {
    const response = await apiClient.get<MovieResponse>(`/Peliculas/buscar?criterioBusqueda=${searchTerm}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching movies:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al buscar películas',
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const getMoviesByGenre = async (genreId: number) => {
  try {
    const response = await apiClient.get<MovieResponse>(`/Peliculas/porGenero/${genreId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching movies by genre ${genreId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || `Error al obtener películas del género con ID ${genreId}`,
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const getMoviesByActor = async (actorId: number) => {
  try {
    const response = await apiClient.get<MovieResponse>(`/Peliculas/porActor/${actorId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching movies by actor ${actorId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || `Error al obtener películas del actor con ID ${actorId}`,
      data: [],
      errors: error.response?.data?.errors || ['Error de conexión con el servidor']
    };
  }
};

export const createMovie = async (movieData: any) => {
  try {
    // Verificar que los actores tengan la estructura correcta
    if (movieData.actores && Array.isArray(movieData.actores)) {
      movieData.actores = movieData.actores.map((actor: any) => ({
        actorId: actor.actorId,
        nombreActor: actor.nombreActor || 'Actor sin nombre',
        personaje: actor.personaje || 'Personaje sin especificar'
      }));
    }
    
    console.log('Datos enviados al crear película:', JSON.stringify(movieData, null, 2));
    console.log('Actores enviados:', JSON.stringify(movieData.actores, null, 2));
    const response = await apiClient.post<SingleMovieResponse>('/Peliculas', movieData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating movie:', error);
    console.error('Response data:', error.response?.data);
    
    // Extraer errores de validación
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = 'Error al crear la película';

    // Si es 401 agregar mensaje de no autorizado
    if (error.status === 401) {
      errorMessages = ['No tienes permisos para realizar esta acción, favor de iniciar sesión'];
    }
    
    if (error.response?.data) {
      const responseData = error.response.data;
      
      // Comprobar si hay mensajes de error específicos
      if (responseData.message) {
        errorMessage = responseData.message;
      }
      
      // Comprobar si hay errores de validación
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          errorMessages = responseData.errors;
        } else if (typeof responseData.errors === 'object') {
          // Convertir errores de validación en mensajes legibles
          errorMessages = Object.entries(responseData.errors).map(
            ([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          );
        }
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      data: null,
      errors: errorMessages
    };
  }
};

export const updateMovie = async (id: number, movieData: any) => {
  try {
    // Verificar que los actores tengan la estructura correcta
    if (movieData.actores && Array.isArray(movieData.actores)) {
      movieData.actores = movieData.actores.map((actor: any) => ({
        actorId: actor.actorId,
        nombreActor: actor.nombreActor || 'Actor sin nombre',
        personaje: actor.personaje || 'Personaje sin especificar'
      }));
    }
    
    console.log(`Datos enviados al actualizar película ${id}:`, JSON.stringify(movieData, null, 2));
    console.log('Actores enviados en actualización:', JSON.stringify(movieData.actores, null, 2));
    const response = await apiClient.put<SingleMovieResponse>(`/Peliculas/${id}`, movieData);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating movie with id ${id}:`, error);
    console.error('Response data:', error.response?.data);
    
    // Extraer errores de validación
    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al actualizar la película con ID ${id}`;
    
    // Si es 401 agregar mensaje de no autorizado
    if (error.status === 401) {
      errorMessages = ['No tienes permisos para realizar esta acción, favor de iniciar sesión'];
    }

    if (error.response?.data) {
      const responseData = error.response.data;      

      // Comprobar si hay mensajes de error específicos
      if (responseData.message) {
        errorMessage = responseData.message;
      }
      
      // Comprobar si hay errores de validación
      if (responseData.errors) {
        if (Array.isArray(responseData.errors)) {
          errorMessages = responseData.errors;
        } else if (typeof responseData.errors === 'object') {
          // Convertir errores de validación en mensajes legibles
          errorMessages = Object.entries(responseData.errors).map(
            ([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          );
        }
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      data: null,
      errors: errorMessages
    };
  }
};

export const deleteMovie = async (id: number) => {
  try {
    const response = await apiClient.delete<SingleMovieResponse>(`/Peliculas/${id}`);
    return response.data;
  } catch (error: any) {

    let errorMessages: string[] = ['Error de conexión con el servidor'];
    let errorMessage = `Error al eliminar la película con ID ${id}`;

    console.error(`Error deleting movie with id ${id}:`, error);

    // Si es 401 agregar mensaje de no autorizado
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