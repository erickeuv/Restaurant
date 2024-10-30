import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener el carrito
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carrito'); // Ajustado a la tabla carrito
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Añadir producto al carrito
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body; // Cambiado cantidad a quantity
  try {
    await pool.query(
      `INSERT INTO carrito (product_id, quantity) 
      VALUES ($1, $2)
      ON CONFLICT (product_id) 
      DO UPDATE SET quantity = carrito.quantity + EXCLUDED.quantity`,
      [productId, quantity]
    );
    res.status(201).json({ message: 'Producto añadido al carrito' });
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ error: 'Error al añadir al carrito' });
  }
});

export default router;
