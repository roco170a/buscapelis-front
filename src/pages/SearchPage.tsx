import React, { useState } from 'react';
import SearchForm from '../components/movies/SearchForm';
import MovieList from '../components/movies/MovieList';
import { searchMovies } from '../services/movieService';
import { Movie } from '../interfaces/Movie';
import '../styles/SearchPage.css';

const SearchPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return;

    try {
      setLoading(true);
      setError(null);
      const response = await searchMovies(searchTerm);
      
      if (response.success) {
        setMovies(response.data);
      } else {
        setError(response.message || 'Error en la búsqueda');
      }
      setHasSearched(true);
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="container my-4">
        <SearchForm onSearch={handleSearch} />
        
        {hasSearched && (
          <div className="search-results mt-5">
            <MovieList movies={movies} loading={loading} error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 