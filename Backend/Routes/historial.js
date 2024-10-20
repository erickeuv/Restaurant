// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Formato de token no válido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;  // Guarda los datos decodificados del token en `req.user`
    next();  // Pasa al siguiente middleware o ruta
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

export default authenticateToken;
