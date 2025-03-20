import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MovieCatalogPage from './pages/MovieCatalogPage';
import ActorCatalogPage from './pages/ActorCatalogPage';
import GenreCatalogPage from './pages/GenreCatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/common/PrivateRoute';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/pelicula/:id" element={<MovieDetailPage />} />
              <Route path="/catalogo/peliculas" element={<MovieCatalogPage />} />
              <Route path="/catalogo/generos" element={<GenreCatalogPage />} />
              <Route path="/catalogo/actores" element={<ActorCatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              
              {/* Protected routes that require authentication */}
              <Route element={<PrivateRoute />}>
                {/* Here would be routes that require authentication */}
              </Route>
              
              {/* Protected routes that require a specific role */}
              <Route element={<PrivateRoute requireRole="Admin" />}>
                <Route path="/catalogo/usuarios" element={<div className="container my-5"><h1>Administración de Usuarios</h1></div>} />
              </Route>
            </Routes>
          </main>
          <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container text-center">
              <span>BuscaPeli &copy; {new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
