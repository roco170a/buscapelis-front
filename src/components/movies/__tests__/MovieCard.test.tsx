import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../MovieCard';
import { Movie } from '../../../interfaces/Movie';

// RCC: Mock data for testing
const mockMovie: Movie = {
  id: 1,
  titulo: 'Pulp Fiction',
  sinopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
  anio: 1994,
  imagenUrl: 'https://example.com/pulp-fiction.jpg',
  fechaCreacion: '2023-01-01T00:00:00',
  generos: [
    { generoId: 1, nombreGenero: 'Crime' },
    { generoId: 2, nombreGenero: 'Drama' }
  ],
  actores: [
    { actorId: 1, nombreActor: 'John Travolta', personaje: 'Vincent Vega' },
    { actorId: 2, nombreActor: 'Samuel L. Jackson', personaje: 'Jules Winnfield' }
  ]
};

describe('MovieCard', () => {
  test('renders movie title correctly', () => {
    // RCC: Render component with router context since it contains Link
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    
    // RCC: Check if the title is rendered
    expect(screen.getByText('Pulp Fiction')).toBeInTheDocument();
  });

  test('renders actors names correctly', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    
    // RCC: Check if the actors are rendered
    expect(screen.getByText('Actores: John Travolta, Samuel L. Jackson')).toBeInTheDocument();
  });

  test('renders main genre badge', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    
    // RCC: Check if the main genre badge is rendered
    expect(screen.getByText('Crime')).toBeInTheDocument();
  });
}); 