import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../interfaces/Movie';
import '../../styles/MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Obtener el género principal (primero en la lista)
  const mainGenre = movie.generos && movie.generos.length > 0 
    ? movie.generos[0].nombreGenero 
    : 'Sin género';

  // Obtener lista de actores
  const actorNames = movie.actores && movie.actores.length > 0
    ? movie.actores.map(actor => actor.nombreActor).join(', ')
    : 'Sin actores';

  // URL de imagen fallback en caso de que la película no tenga una
  const imageFallback = 'nofound.jpg';

  return (
    <div className="movie-card">
      <div className="card h-100">
        <img 
          src={movie.imagenUrl || imageFallback} 
          className="card-img-top movie-image" 
          alt={movie.titulo} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = imageFallback;
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{movie.titulo}</h5>
          <p className="card-text actor-names">Actores: {actorNames}</p>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <Link to={`/pelicula/${movie.id}`} className="btn btn-primary">
              Detalles
            </Link>
            <span className="genre-badge">{mainGenre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 