import React from 'react';

const CategoryMenu = ({ categories }) => {

  const scrollToCategory = (category) => {
    const element = document.getElementById(category);
    if (element) {
      const offset = -100; // Ajusta este valor según el tamaño de tu header o cualquier elemento fijo en la parte superior
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md flex justify-center flex-wrap space-x-2 space-y-2 md:space-y-0 md:space-x-4 my-4 py-2 border-b border-gray-300"> {/* Flexbox responsivo */}
      {categories.map((category) => (
        <button 
          key={category}
          onClick={() => scrollToCategory(category)} 
          className="bg-gray-300 text-black font-bold rounded-lg px-4 py-2 md:px-4 md:py-3 hover:bg-gray-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" // Estilos optimizados
          aria-label={`Ir a la categoría ${category}`} // Mejora de accesibilidad
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
