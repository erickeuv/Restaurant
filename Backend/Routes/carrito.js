// backend/routes/carrito.js

import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el carrito (puedes usar una sesión o cookies para identificar al carrito)
router.get('/', async (req, res) => {
  try {
    // Aquí podrías usar un método diferente para identificar el carrito,
    // como usar cookies o una sesión
    const result = await pool.query('SELECT * FROM detalle_carrito'); // Si es anónimo
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Añadir producto al carrito
router.post('/', async (req, res) => {
  const { productId, cantidad } = req.body; // Quitamos userId
  try {
    await pool.query(
      `INSERT INTO detalle_carrito (product_id, cantidad) 
      VALUES ($1, $2)
      ON CONFLICT (product_id) 
      DO UPDATE SET cantidad = detalle_carrito.cantidad + EXCLUDED.cantidad`,
      [productId, cantidad]
    );
    res.status(201).json({ message: 'Producto añadido al carrito' });
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ error: 'Error al añadir al carrito' });
  }
});

export default router;
