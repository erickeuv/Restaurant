import React from 'react';
import PropTypes from 'prop-types';

function ProductCard({ title, imageUrl, description, price, onAdd }) {
  return (
    <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg my-4 w-full max-w-xs h-full"> {/* Estandarización del tamaño */}
      <div className="m-2.5 overflow-hidden rounded-md h-32 flex justify-center items-center">
        <img 
          className="w-2/3 h-full object-cover"
          src={imageUrl} 
          alt={title || 'Producto'} 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow text-center"> {/* flex-grow permite que el contenido se ajuste */}
        <h4 className="mb-1 text-lg font-semibold text-slate-800">{title || 'Título del Producto'}</h4>
        <p className="text-sm text-slate-600 mt-2 font-light line-clamp-3">{description || 'Descripción del producto.'}</p> {/* Truncar a 3 líneas */}

        {/* Espacio flexible para empujar el contenido al final */}
        <div className="flex-grow"></div> 

        <div className="flex items-center justify-between mt-4"> {/* Contenedor para precio y botón */}
          <span className="text-lg font-bold text-slate-800">${price}</span>
          <button 
            className="flex items-center justify-center rounded-full bg-slate-800 h-8 w-8 text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
            type="button" 
            aria-label={`Añadir ${title} al carrito`}
            onClick={() => onAdd({ title, price: parseFloat(price.replace('$', '')) })} // Asegúrate de que price sea un número
          >
            +
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
};

export default ProductCard;
