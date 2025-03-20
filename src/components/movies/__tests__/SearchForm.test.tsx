import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm';

describe('SearchForm Component', () => {
  test('renders search form correctly', () => {
    render(<SearchForm onSearch={() => {}} />);
    
    // RCC: Check if the title and subtitle are rendered
    expect(screen.getByText('Búsqueda')).toBeInTheDocument();
    expect(screen.getByText('Buscar tu película favorita por título, actor o genero')).toBeInTheDocument();
    
    // RCC: Check if input and button are rendered
    expect(screen.getByPlaceholderText('Escribe aquí lo que buscas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  test('search button is disabled when input is empty', () => {
    render(<SearchForm onSearch={() => {}} />);
    
    // RCC: Button should be disabled initially
    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    expect(searchButton).toBeDisabled();
  });

  test('search button is enabled when input has text', () => {
    render(<SearchForm onSearch={() => {}} />);
    
    // RCC: Fill the input
    const searchInput = screen.getByPlaceholderText('Escribe aquí lo que buscas');
    fireEvent.change(searchInput, { target: { value: 'Avatar' } });
    
    // RCC: Button should be enabled
    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    expect(searchButton).not.toBeDisabled();
  });

  test('calls onSearch with input value when form is submitted', () => {
    // RCC: Create a mock function for onSearch
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} />);
    
    // RCC: Fill the input
    const searchInput = screen.getByPlaceholderText('Escribe aquí lo que buscas');
    fireEvent.change(searchInput, { target: { value: 'Matrix' } });
    
    // RCC: Submit the form
    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    fireEvent.click(searchButton);
    
    // RCC: Check if onSearch was called with the right value
    expect(mockOnSearch).toHaveBeenCalledWith('Matrix');
  });
}); 