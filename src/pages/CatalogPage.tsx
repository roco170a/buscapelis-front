import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGenres } from '../services/genreService';
import { Genre } from '../interfaces/Genre';
import '../styles/CatalogPage.css';

const CatalogPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getGenres();
        
        if (response.success) {
          setGenres(response.data);
        } else {
          setError(response.message || 'Error al cargar los géneros');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando catálogos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="container my-5">
        <h1 className="mb-4">Catálogos</h1>

        <div className="row mb-5">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2 className="h5 mb-0">Géneros</h2>
              </div>
              <div className="card-body">
                {genres.length > 0 ? (
                  <div className="row">
                    {genres.map(genre => (
                      <div className="col-md-3 mb-3" key={genre.id}>
                        <div className="genre-card">
                          <Link 
                            to={`/peliculas/genero/${genre.id}`} 
                            className="text-decoration-none"
                          >
                            <div className="p-3 border rounded text-center genre-item">
                              {genre.nombre}
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay géneros disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;