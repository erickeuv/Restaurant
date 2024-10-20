import express from 'express';
import pool from '../config/database.js';
import authenticateToken from '../middleware/authMiddleware.js'; // Usa el middleware de autenticación

const router = express.Router();

// Registrar una compra
router.post('/', authenticateToken, async (req, res) => {
  const { cart, totalAmount } = req.body;

  // Verifica si hay un carrito y un total
  if (!cart || !totalAmount) {
    return res.status(400).json({ error: 'El carrito y el total son obligatorios.' });
  }

  const { id: userId, email } = req.user; // Obtener el userId y email del token decodificado

  try {
    // Iniciar una transacción
    await pool.query('BEGIN');

    // Insertar la compra en la tabla purchases
    const purchaseResult = await pool.query(
      'INSERT INTO purchases (user_id, email, total_amount) VALUES ($1, $2, $3) RETURNING id',
      [userId, email, totalAmount]
    );

    const purchaseId = purchaseResult.rows[0].id;

    // Insertar los items en la tabla purchase_items
    for (let item of cart) {
      const { id: productId, name: productName, category, description, price, quantity } = item;
      const subtotal = price * quantity;

      // Obtener image_url desde la tabla Products
      const productResult = await pool.query(
        'SELECT image_url FROM products WHERE id = $1',
        [productId]
      );

      // Verifica si el producto existe
      if (productResult.rows.length === 0) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      const image_url = productResult.rows[0].image_url || 'default_image_url'; // Manejar caso de que no se encuentre la imagen

      // Insertar cada item del carrito en la tabla purchase_items
      await pool.query(
        'INSERT INTO purchase_items (purchase_id, product_id, product_name, category, description, image_url, price, quantity, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          purchaseId,
          productId,
          productName,
          category,
          description,
          image_url,
          price,
          quantity,
          subtotal,
        ]
      );
    }

    // Confirmar la transacción
    await pool.query('COMMIT');

    res.status(201).json({ message: 'Compra registrada exitosamente' });
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query('ROLLBACK');
    console.error('Error al registrar la compra:', error.message);

    // Manejo específico de errores
    if (error.message.includes('Producto con ID')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Hubo un problema al registrar la compra.' });
  }
});

// Obtener historial de compras del usuario autenticado
router.get('/historial', authenticateToken, async (req, res) => {
  const { id: userId } = req.user; // Obtener el userId del token decodificado

  try {
    // Obtener las compras del usuario
    const purchasesResult = await pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 ORDER BY purchase_date DESC',
      [userId]
    );

    if (purchasesResult.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron compras para este usuario.' });
    }

    // Obtener los detalles de los productos comprados en cada compra
    const purchases = await Promise.all(purchasesResult.rows.map(async (purchase) => {
      const itemsResult = await pool.query(
        'SELECT * FROM purchase_items WHERE purchase_id = $1',
        [purchase.id]
      );

      return {
        ...purchase, // Información de la compra (purchases)
        items: itemsResult.rows, // Detalles de los productos comprados (purchase_items)
      };
    }));

    // Enviar la lista de compras y sus productos
    res.json(purchases);
  } catch (error) {
    console.error('Error al obtener el historial de compras:', error.message);
    res.status(500).json({ error: 'Hubo un problema al obtener el historial de compras.' });
  }
});

export default router;
