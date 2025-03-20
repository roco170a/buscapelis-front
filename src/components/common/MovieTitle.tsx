import React from 'react';

interface MovieTitleProps {
  title: string;
  year?: number;
}

// RCC: Simple component to display a movie title with optional year
const MovieTitle: React.FC<MovieTitleProps> = ({ title, year }) => {
  return (
    <div className="movie-title">
      <h2>{title}</h2>
      {year && <span className="year">({year})</span>}
    </div>
  );
};

export default MovieTitle; 