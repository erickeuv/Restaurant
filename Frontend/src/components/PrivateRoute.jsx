import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole, token } = useContext(AuthContext); // Obtén el estado de autenticación, rol y token
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica si el token existe y si `isAuthenticated` ya se ha determinado
        if (token && isAuthenticated === false) {
            setLoading(false); // El token es válido y `isAuthenticated` se ha verificado
        } else {
            setLoading(false); // Estado de carga completado
        }
    }, [isAuthenticated, token]);

    
    if (loading) {
        return <div className="text-center">Cargando...</div>; 
    }

    // Verifica la autenticación
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }

    // Verifica el rol del usuario si se proporciona `requiredRole`
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />; // Redirige al inicio si el rol no es suficiente
    }

    // Muestra los componentes protegidos si la autenticación y el rol son correctos
    return children;
};

export default PrivateRoute;
