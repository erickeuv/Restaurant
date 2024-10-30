import React from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { CartProvider } from '../context/CartContext';
import CategoryMenu from '../components/CategoryMenu';

function Menu() {
  const categories = ['Hamburgers', 'Sushi', 'Gohan', 'Beverages', 'Desserts']; // Lista de categorías

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {/* Mantén el header como un contenedor independiente */}
        <header>
          {/* Contenido del header aquí */}
        </header>

        {/* Sección sticky separada para el CategoryMenu */}
        <div className="sticky top-[60px] z-10 bg-white shadow-md">
          <CategoryMenu categories={categories} />
        </div>

        <main className="flex-grow container mx-auto">
          <div className="row">
            <div className="col-md-8">
              {/* Lista de productos con el estilo estandarizado aplicado a los botones */}
              <ProductList />
            </div>
            <div className="col-md-4">
              <Cart />
            </div>
          </div>
        </main>
        
      </div>
    </CartProvider>
  );
}

export default Menu;
