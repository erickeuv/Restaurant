import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Necesitarás instalar jwt-decode: npm install jwt-decode

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token); // Decodifica el token para obtener la información del usuario
      setUserRole(decodedToken.role); // Asigna el rol desde el token decodificado
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuthenticated(true);

    const decodedToken = jwt_decode(token); // Decodifica el token para obtener la información del usuario
    setUserRole(decodedToken.role); // Asigna el rol
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUserRole(null); // Limpia el rol al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
