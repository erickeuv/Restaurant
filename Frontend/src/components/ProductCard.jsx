import React from 'react';
import PropTypes from 'prop-types';

function ProductCard({ title, imageUrl, description, price, onAdd, isActive }) {
  return (
    <div className={`flex flex-col shadow-sm border rounded-lg my-4 w-full max-w-xs h-full ${isActive ? 'bg-white border-slate-200' : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'}`}>
      <div className="m-2.5 overflow-hidden rounded-md h-32 flex justify-center items-center">
        <img 
          className="w-2/3 h-full object-cover"
          src={imageUrl} 
          alt={title || 'Producto'} 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow text-center">
        <h4 className="mb-1 text-lg font-semibold">{title || 'Título del Producto'}</h4>
        <p className="text-sm mt-2 font-light line-clamp-3">{description || 'Descripción del producto.'}</p>

        <div className="flex-grow"></div> 

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">${price}</span>
          <button 
            className="flex items-center justify-center rounded-full h-8 w-8 text-center text-lg transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
            type="button" 
            aria-label={`Añadir ${title} al carrito`}
            onClick={() => onAdd({ title, price: parseFloat(price.replace('$', '')) })}
            disabled={!isActive}
            style={{
              backgroundColor: isActive ? '#1e293b' : '#a0aec0',
              color: isActive ? 'white' : 'gray'
            }}
          >
            {isActive ? '+' : 'No disponible'}
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default ProductCard;
