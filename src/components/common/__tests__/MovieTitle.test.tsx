import { render, screen } from '@testing-library/react';
import MovieTitle from '../MovieTitle';

describe('MovieTitle Component', () => {
  test('renders the title correctly', () => {
    render(<MovieTitle title="Star Wars" />);
    expect(screen.getByText('Star Wars')).toBeInTheDocument();
  });

  test('renders the year when provided', () => {
    render(<MovieTitle title="Star Wars" year={1977} />);
    expect(screen.getByText('Star Wars')).toBeInTheDocument();
    expect(screen.getByText('(1977)')).toBeInTheDocument();
  });

  test('does not render year when not provided', () => {
    render(<MovieTitle title="Unknown Movie" />);
    expect(screen.getByText('Unknown Movie')).toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });
}); 