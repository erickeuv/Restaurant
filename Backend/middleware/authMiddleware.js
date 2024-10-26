import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('No se proporcionó un token');
    return res.status(401).json({ error: 'No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Formato de token no válido');
    return res.status(401).json({ error: 'Formato de token no válido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado correctamente:', decoded);
    req.user = decoded; // Almacena los datos decodificados del token en `req.user`
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('El token ha expirado');
      return res.status(401).json({ error: 'El token ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Token no válido');
      return res.status(401).json({ error: 'Token no válido.' });
    } else {
      console.log('Error en la autenticación:', error);
      return res.status(500).json({ error: 'Error en la autenticación.' });
    }
  }
};

// Nuevo middleware para verificar si el usuario es "admin"
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

export { authMiddleware, adminMiddleware };
