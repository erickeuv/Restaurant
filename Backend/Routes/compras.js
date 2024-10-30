import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Usa el middleware de autenticación correctamente

const router = express.Router();

// Registrar una compra
router.post('/', authMiddleware, async (req, res) => {
  const { cart, totalAmount } = req.body;

  // Verifica si hay un carrito y un total
  if (!cart || !totalAmount) {
    return res.status(400).json({ error: 'El carrito y el total son obligatorios.' });
  }

  const { id: userId } = req.user; // Obtener el userId del token decodificado

  try {
    // Iniciar una transacción
    await pool.query('BEGIN');

    // Insertar la compra en la tabla purchases
    const purchaseResult = await pool.query(
      'INSERT INTO purchases (user_id, total_amount) VALUES ($1, $2) RETURNING id',
      [userId, totalAmount]
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

router.get('/historial', authMiddleware, async (req, res) => {
  const { id: userId } = req.user;

  try {
    const purchasesResult = await pool.query(
      `SELECT p.id as purchase_id, p.purchase_date, p.total_amount,
              pi.product_id, pi.product_name, pi.category, pi.description,
              pi.image_url, pi.price, pi.quantity, pi.subtotal
       FROM purchases p
       JOIN purchase_items pi ON p.id = pi.purchase_id
       WHERE p.user_id = $1
       ORDER BY p.purchase_date DESC`,
      [userId]
    );

    if (purchasesResult.rows.length === 0) {
      return res.status(200).json([]); // Si no hay compras, devuelve un array vacío
    }

    // Organiza los datos en un formato estructurado
    const purchases = purchasesResult.rows.reduce((acc, row) => {
      const {
        purchase_id,
        purchase_date,
        total_amount,
        product_id,
        product_name,
        category,
        description,
        image_url,
        price,
        quantity,
        subtotal,
      } = row;

      // Encuentra la compra en el acumulador o crea una nueva
      let purchase = acc.find(p => p.id === purchase_id);
      if (!purchase) {
        purchase = {
          id: purchase_id,
          purchase_date,
          total_amount,
          items: [],
        };
        acc.push(purchase);
      }

      // Añade el item a la compra correspondiente
      purchase.items.push({
        product_id,
        product_name,
        category,
        description,
        image_url,
        price,
        quantity,
        subtotal,
      });

      return acc;
    }, []);

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error al obtener el historial de compras:', error.message);
    res.status(500).json({ error: 'Hubo un problema al obtener el historial de compras.' });
  }
});
