import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieList from '../components/movies/MovieList';
import { getMovies } from '../services/movieService';
import { Movie } from '../interfaces/Movie';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMovies();
        
        if (response.success) {
          setMovies(response.data);
        } else {
          setError(response.message || 'Error al cargar las películas');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchClick = () => {
    navigate('/buscar');
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center">
              <p className="lead mb-4">                
                Demostracion con fines educativos de despliegue de aplicación de repositorio GitHub: <a href="https://github.com/juanpabon/PeliculasAPI" target="_blank" rel="noopener noreferrer">https://github.com/juanpabon/PeliculasAPI</a>
              </p>
              <h1 className="display-4 mb-4">Encuentra tus películas favoritas</h1>
              <p className="lead mb-4">
                Explora nuestra colección de películas por título, género o actores.
                
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSearchClick}
              >
                Comenzar a buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-movies py-5">
        <div className="container">
          <h2 className="text-center mb-4">Películas Recientes</h2>
          <MovieList movies={movies} loading={loading} error={error} />
        </div>
      </section>
    </div>
  );
};

export default HomePage; 