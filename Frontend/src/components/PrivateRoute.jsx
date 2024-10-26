import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext); // Usa el estado de autenticación y el rol

    // Muestra un indicador de carga mientras se determina el estado de autenticación
    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Puedes personalizar este mensaje
    }

    // Verifica la autenticación
    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Redirige a login si no está autenticado
    }

    // Verifica el rol del usuario si se proporciona `requiredRole`
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />; // Redirige al inicio si el rol no es suficiente
    }

    // Muestra los componentes protegidos si la autenticación y el rol son correctos
    return children;
};

export default PrivateRoute;
