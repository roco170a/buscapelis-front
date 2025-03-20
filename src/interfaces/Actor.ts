export interface Actor {
  id: number;
  nombre: string;
  fotoUrl: string;
  biografia: string;
  fechaCreacion: string;
}

export interface ActorResponse {
  success: boolean;
  message: string;
  data: Actor[];
  errors: string[];
} 