import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import '../../styles/Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar expand="lg" variant="dark" className="navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <img 
            src="/movie-icon.svg" 
            alt="Logo" 
            width="30" 
            height="30" 
            className="d-inline-block align-top me-2" 
          />
          BuscaPeli
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="navbarMain" />
        
        <BootstrapNavbar.Collapse id="navbarMain">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/buscar">Búsqueda</Nav.Link>
            
            <NavDropdown title="Catálogos" id="catalogos-dropdown">
              <NavDropdown.Item as={Link} to="/catalogo/peliculas">
                Películas
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/catalogo/generos">
                Géneros
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/catalogo/actores">
                Actores
              </NavDropdown.Item>
              {isAuthenticated && user?.role === "Admin" && (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/catalogo/usuarios">
                    Usuarios
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={`Hola, ${user?.nombre || user?.userName}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <small>Rol: {user?.role}</small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 