import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el carrito para un usuario autenticado
router.get('/', async (req, res) => {
  const { user_id } = req.query; // Asegurarse de recibir el user_id (reemplaza esto con el token de autenticación en producción)
  
  try {
    const result = await pool.query('SELECT * FROM carrito WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Añadir o actualizar productos en el carrito para un usuario autenticado
router.post('/', async (req, res) => {
  const { user_id, productId, quantity } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'El ID de usuario es necesario' });
  }

  try {
    await pool.query(
      `INSERT INTO carrito (user_id, product_id, quantity) 
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = carrito.quantity + EXCLUDED.quantity`,
      [user_id, productId, quantity]
    );
    res.status(201).json({ message: 'Producto añadido al carrito' });
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ error: 'Error al añadir al carrito' });
  }
});

// Sincronizar el carrito desde el frontend (al iniciar sesión)
router.post('/sync', async (req, res) => {
  const { user_id, cart } = req.body;
  if (!user_id || !Array.isArray(cart)) {
    return res.status(400).json({ error: 'Datos de sincronización no válidos' });
  }

  try {
    // Agrega cada elemento del carrito en la base de datos
    const promises = cart.map(item =>
      pool.query(
        `INSERT INTO carrito (user_id, product_id, quantity) 
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id) 
        DO UPDATE SET quantity = carrito.quantity + EXCLUDED.quantity`,
        [user_id, item.productId, item.quantity]
      )
    );
    
    await Promise.all(promises);
    res.status(200).json({ message: 'Carrito sincronizado exitosamente' });
  } catch (err) {
    console.error('Error al sincronizar el carrito:', err);
    res.status(500).json({ error: 'Error al sincronizar el carrito' });
  }
});

export default router;
