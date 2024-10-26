import express from 'express';
import pool from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE active = true');
    res.json(result.rows); // Devolver solo los productos activos
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1 AND active = true', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto (solo para administradores)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, category, description, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, category, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, category, description, image_url]
    );
    res.status(201).json(result.rows[0]); // Devolver el producto creado
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Desactivar un producto por ID (solo para administradores)
router.put('/:id/deactivate', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE products SET active = false WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto desactivado exitosamente' });
  } catch (error) {
    console.error('Error al desactivar el producto:', error);
    res.status(500).json({ error: 'Error al desactivar el producto' });
  }
});

export default router;
