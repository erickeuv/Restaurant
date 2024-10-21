import express from 'express';
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Hubo un error al registrar el usuario.' });
  }
});

// Iniciar sesión y generar un token JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta.' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    // Devolver el token y detalles del usuario
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un error al iniciar sesión.' });
  }
});

// Obtener el perfil del usuario autenticado
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado.' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Hubo un error al obtener el perfil del usuario.' });
  }
});

// Actualizar el perfil del usuario autenticado
// Obtener el perfil del usuario autenticado
router.get('/profile', async (req, res) => {
  try {
    // Verificar si el token está presente en los headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado.' });
    }

    // Verificar el token y decodificar
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido o ha expirado.' });
    }

    // Consulta para obtener los datos del usuario
    const user = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Enviar la información del usuario
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Hubo un error al obtener el perfil del usuario.' });
  }
});


export default router;
