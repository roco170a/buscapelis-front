import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { getActors } from '../services/actorService';
import { Movie } from '../interfaces/Movie';
import { Actor } from '../interfaces/Actor';
import '../styles/MovieDetailPage.css';
import '../styles/ActorCards.css';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actorsInfo, setActorsInfo] = useState<Actor[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getMovieById(parseInt(id));
        
        if (response.success) {
          setMovie(response.data);
          
          // RCC Get additional actor data to obtain their photos
          const actorsResponse = await getActors();
          if (actorsResponse.success && actorsResponse.data.length > 0) {
            setActorsInfo(actorsResponse.data);
          }
        } else {
          setError(response.message || 'Error al cargar la película');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando detalles de la película...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error || 'No se encontró la película'}
        </div>
        <Link to="/buscar" className="btn btn-primary">
          Volver a la búsqueda
        </Link>
      </div>
    );
  }

  // RCC Fallback image URL in case the movie doesn't have one
  const imageFallback = '/placeholder-movie.png';
  // RCC Fallback image URL for actors without a photo
  const actorImageFallback = '/placeholder-actor.png';

  // RCC Function to get the photo URL of an actor
  const getActorPhotoUrl = (actorId: number): string => {
    const actor = actorsInfo.find(a => a.id === actorId);
    return actor?.fotoUrl || actorImageFallback;
  };

  return (
    <div className="movie-detail-page">
      <div className="container my-5">
        <div className="row">
          <div className="col-md-4">
            <div className="movie-poster-container">
              <img
                src={movie.imagenUrl || imageFallback}
                alt={movie.titulo}
                className="img-fluid movie-poster-detail"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = imageFallback;
                }}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="movie-info">
              <h1 className="movie-title">{movie.titulo} ({movie.anio})</h1>
              <div className="mb-3">
                {movie.generos && movie.generos.map(genero => (
                  <span key={genero.generoId} className="badge bg-secondary me-2">
                    {genero.nombreGenero}
                  </span>
                ))}
              </div>
              <div className="movie-synopsis mb-4">
                <h5>Sinopsis</h5>
                <p>{movie.sinopsis || 'No hay sinopsis disponible'}</p>
              </div>
              
              <div className="movie-cast mb-4">
                <h5 className="mb-3">Reparto</h5>
                {movie.actores && movie.actores.length > 0 ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {movie.actores.map(actor => (
                      <div key={actor.actorId} className="col">
                        <div className="movie-detail-actor-card">
                          <div className="movie-detail-actor-hover-label">
                            Ver foto completa
                          </div>
                          <img 
                            src={getActorPhotoUrl(actor.actorId)} 
                            alt={actor.nombreActor}
                            className="movie-detail-actor-photo"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = actorImageFallback;
                            }}
                          />
                          <div className="movie-detail-actor-info">
                            <h6 className="movie-detail-actor-name">{actor.nombreActor}</h6>
                            {actor.personaje && (
                              <div className="movie-detail-actor-character">
                                como {actor.personaje}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No hay información del reparto disponible
                  </div>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <Link to="/buscar" className="btn btn-primary">
                  Ir a la búsqueda
                </Link>
                <Link to="/catalogo/peliculas" className="btn btn-primary">
                  Ir al catálogo de películas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage; 