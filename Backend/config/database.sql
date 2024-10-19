-- Crear una nueva base de datos llamada resto_burger_jwt
-- CREATE DATABASE resto_burger_jwt;

-- Tabla: users
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Products
DROP TABLE IF EXISTS Products CASCADE;
CREATE TABLE Products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT,
    description TEXT,
    image_url TEXT
);

-- Tabla: purchases
DROP TABLE IF EXISTS purchases CASCADE;
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    email TEXT NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT NOW(),
    total_amount NUMERIC(10, 2) NOT NULL
);

-- Tabla: purchase_items
DROP TABLE IF EXISTS purchase_items CASCADE;
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id),
    product_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- Tabla: carrito
DROP TABLE IF EXISTS carrito CASCADE;
CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    product_id BIGINT REFERENCES Products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP NOT NULL DEFAULT NOW()
);