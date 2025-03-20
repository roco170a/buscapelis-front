export interface Genre {
  id: number;
  nombre: string;
  fechaCreacion: string;
}

export interface GenreResponse {
  success: boolean;
  message: string;
  data: Genre[];
  errors: string[];
} 