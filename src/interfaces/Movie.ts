export interface Movie {
  id: number;
  titulo: string;
  sinopsis: string;
  anio: number;
  imagenUrl: string;
  fechaCreacion: string;
  generos: GeneroDTO[];
  actores: ActorDTO[];
}

export interface GeneroDTO {
  generoId: number;
  nombreGenero: string;
}

export interface ActorDTO {
  actorId: number;
  nombreActor: string;
  personaje: string;
  fotoUrl?: string;
}

export interface MovieResponse {
  success: boolean;
  message: string;
  data: Movie[];
  errors: string[];
}

export interface SingleMovieResponse {
  success: boolean;
  message: string;
  data: Movie;
  errors: string[];
} 