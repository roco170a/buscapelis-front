import React from 'react';
import { Movie } from '../../interfaces/Movie';
import MovieCard from './MovieCard';
import '../../styles/MovieList.css';

interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const MovieList: React.FC<MovieListProps> = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando películas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        Error: {error}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="alert alert-info my-4" role="alert">
        No se encontraron películas que coincidan con tu búsqueda.
      </div>
    );
  }

  return (
    <div className="movie-list">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {movies.map((movie) => (
          <div className="col" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList; 