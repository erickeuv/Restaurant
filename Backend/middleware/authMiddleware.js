import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si el encabezado de autorización está presente
  if (!authHeader) {
    console.log('No se proporcionó un token');
    return res.status(401).json({ error: 'No se proporcionó un token.' });
  }

  // El token debe estar en el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Formato de token no válido');
    return res.status(401).json({ error: 'Formato de token no válido.' });
  }

  try {
    // Decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado correctamente:', decoded);
    req.user = decoded; // Almacenar los datos decodificados del token en el objeto de solicitud
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    // Manejo de errores específicos
    if (error.name === 'TokenExpiredError') {
      console.log('El token ha expirado');
      return res.status(401).json({ error: 'El token ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Token no válido');
      return res.status(401).json({ error: 'Token no válido.' });
    } else {
      // Cualquier otro error relacionado con la autenticación
      console.log('Error en la autenticación:', error);
      return res.status(500).json({ error: 'Error en la autenticación.' });
    }
  }
};

export default authMiddleware;
