import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el carrito para un usuario autenticado
router.get('/', async (req, res) => {
  const { user_id } = req.query; 
  if (!user_id) {
    return res.status(400).json({ error: 'El ID de usuario es necesario para obtener el carrito.' });
  }

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

  // Validar los datos recibidos
  if (!user_id) {
    return res.status(400).json({ error: 'El ID de usuario es necesario.' });
  }
  if (!productId) {
    return res.status(400).json({ error: 'El ID del producto es necesario.' });
  }
  if (quantity == null || quantity < 1) {
    return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
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

  // Validar los datos de sincronización
  if (!user_id) {
    return res.status(400).json({ error: 'El ID de usuario es necesario para la sincronización.' });
  }
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'El carrito debe ser un arreglo con productos.' });
  }

  try {
    const promises = cart.map(item => {
      const { productId, quantity } = item;
      if (!productId || quantity == null || quantity < 1) {
        throw new Error('Cada producto debe tener un ID y una cantidad válida.');
      }

      return pool.query(
        `INSERT INTO carrito (user_id, product_id, quantity) 
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id) 
        DO UPDATE SET quantity = carrito.quantity + EXCLUDED.quantity`,
        [user_id, productId, quantity]
      );
    });

    await Promise.all(promises);
    res.status(200).json({ message: 'Carrito sincronizado exitosamente' });
  } catch (err) {
    console.error('Error al sincronizar el carrito:', err);
    if (err.message.includes('Cada producto debe tener un ID y una cantidad válida')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al sincronizar el carrito' });
  }
});

export default router;
