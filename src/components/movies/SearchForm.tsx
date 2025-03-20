import React, { useState } from 'react';
import '../../styles/SearchForm.css';

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="search-title">Búsqueda</h2>
          <p className="search-subtitle">Buscar tu película favorita por título, actor o genero</p>
        </div>
        <div className="input-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Escribe aquí lo que buscas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Búsqueda"
            aria-describedby="button-search"
          />
          <button
            className="btn btn-primary search-button"
            type="submit"
            id="button-search"
            disabled={searchTerm.trim() === ''}
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 