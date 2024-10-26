import { createContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  // Decodificar el payload de un JWT sin librerías externas
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Función para manejar el inicio de sesión
  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setIsAuthenticated(true);

    const decodedToken = decodeToken(token);
    if (decodedToken) {
      setUserRole(decodedToken.role); // Asigna el rol desde el token decodificado
    } else {
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
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role);
        } else {
          logout(); // Cierra sesión si el token ha expirado o es inválido
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
