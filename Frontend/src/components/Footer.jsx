import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-4 md:p-6 text-white"> {/* Fondo oscuro con transparencia y padding ajustado */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-y-0 md:gap-x-8"> {/* Contenedor principal ajustado */}
        
        {/* Logo alineado */}
        <img 
          src="https://tofuu.getjusto.com/orioneat-local/resized2/BAbPLCBTJhJkJJx5F-1400-x.webp" 
          alt="logo-ct" 
          className="w-8 md:w-10 mb-2 md:mb-0" 
        />

        {/* Lista de redes sociales */}
        <ul className="flex justify-center gap-x-4">
          <li>
            <a
              href="https://facebook.com" 
              className="transition-colors hover:text-gray-400 focus:text-gray-400" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="w-5 h-5 md:w-6 md:h-6" /> {/* Icono de Facebook ajustado */}
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com" 
              className="transition-colors hover:text-gray-400 focus:text-gray-400" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-5 h-5 md:w-6 md:h-6" /> {/* Icono de Twitter ajustado */}
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com" 
              className="transition-colors hover:text-gray-400 focus:text-gray-400" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-5 h-5 md:w-6 md:h-6" /> {/* Icono de Instagram ajustado */}
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/" 
              className="transition-colors hover:text-gray-400 focus:text-gray-400" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="w-5 h-5 md:w-6 md:h-6" /> {/* Icono de LinkedIn ajustado */}
            </a>
          </li>
        </ul>
      </div>

      <hr className="my-4 md:my-6 border-gray-700" /> {/* Línea de separación ajustada */}

      {/* Copyright */}
      <p className="text-center text-sm font-light">
        &copy; 2024 Sushi & Burger Home. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
