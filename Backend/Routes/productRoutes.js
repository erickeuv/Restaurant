import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows); // Devolver los productos como JSON
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Obtener productos por categoría
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    res.json(result.rows); // Devolver los productos de la categoría como JSON
  } catch (error) {
    console.error('Error al obtener los productos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener los productos por categoría' });
  }
});

// Crear un nuevo producto (POST)
router.post('/', async (req, res) => {
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

// Actualizar un producto por ID (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, image_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, category = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, price, category, description, image_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]); // Devolver el producto actualizado
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
