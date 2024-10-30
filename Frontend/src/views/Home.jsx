import React from 'react';
import { Link } from 'react-router-dom'; 
import bannerImage from '../assets/img/Banner_Home.webp';

const Home = () => {
  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden flex-grow">
      <img 
        src={bannerImage} 
        alt="Banner" 
        className="w-full h-full object-cover" 
      />
      {/* Superposición de color */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* Contenido del banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold">Bienvenidos a Sushi & Burger Home</h1>
        <p className="mt-2 text-lg md:text-xl">Deliciosas comidas para todos los gustos</p>
        <Link to="/Menu">
          <button className="mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300">
            Ver Menú
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
