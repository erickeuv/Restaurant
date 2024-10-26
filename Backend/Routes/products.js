import express from 'express';
import pool from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todos los productos (para administración)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products'); // Obtener todos los productos, sin filtrar por estado
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener productos activos para el menú
router.get('/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE active = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los productos del menú:', error);
    res.status(500).json({ error: 'Error al obtener los productos del menú' });
  }
});

// Obtener un producto activo por ID
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
      'INSERT INTO products (name, price, category, description, image_url, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, category, description, image_url, true] // Por defecto, el producto se crea como activo
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Alternar el estado activo de un producto por ID (solo para administradores)
router.put('/:id/toggle-active', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT active FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const currentStatus = result.rows[0].active;
    const updatedProduct = await pool.query(
      'UPDATE products SET active = $1 WHERE id = $2 RETURNING *',
      [!currentStatus, id]
    );

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Error al alternar el estado del producto:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del producto' });
  }
});

export default router;
