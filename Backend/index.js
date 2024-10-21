import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pool from './config/database.js';
import usersRouter from './Routes/users.js';
import carritoRouter from './Routes/carrito.js';
import comprasRouter from './Routes/compras.js';
import productRouter from './Routes/productRoutes.js'; // Importar la ruta de productos
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

// Determinar qué archivo de variables de entorno cargar
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 5000;

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Configurar seguridad HTTP headers

// Configurar CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Asegúrate de usar variables de entorno para la URL de producción
    credentials: true,
  })
);

// Servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/products', productRouter); // Añadir la ruta de productos

// Verificar la conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('Conexión exitosa a la base de datos', res.rows);
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
});

// Iniciar el servidor solo si no se está ejecutando en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

// Exportar la aplicación para usarla en los tests
export default app;
