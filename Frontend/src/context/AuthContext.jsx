import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Importación correcta

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  // Función para manejar el inicio de sesión
  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuthenticated(true);

    try {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role); // Asigna el rol desde el token decodificado
    } catch (error) {
      console.error("Error decoding token on login:", error);
      logout(); // En caso de error, cierra la sesión
    }
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUserRole(null); // Limpia el rol al cerrar sesión
  };

  // Verificación inicial del token al cargar el componente
  useEffect(() => {
    const verifyToken = () => {
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          if (decodedToken.exp * 1000 > Date.now()) { // Verifica si el token no ha expirado
            setIsAuthenticated(true);
            setUserRole(decodedToken.role);
          } else {
            logout(); // Cierra sesión si el token ha expirado
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          logout(); // Cierra sesión si el token es inválido
        }
      }
    };
    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
