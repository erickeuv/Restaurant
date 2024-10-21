import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-gray-900 p-8 text-white"> {/* Fondo oscuro y texto blanco */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-6 md:gap-y-0 md:gap-x-12"> {/* Contenedor principal */}
        
        {/* Logo alineado */}
        <img 
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png" 
          alt="logo-ct" 
          className="w-10 mb-4 md:mb-0" 
        />

        {/* Lista de redes sociales */}
        <ul className="flex justify-center gap-x-6">
          <li>
            <a
              href="https://facebook.com" 
              className="transition-colors hover:text-gray-300 focus:text-gray-300" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="w-6 h-6" /> {/* Icono de Facebook */}
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com" 
              className="transition-colors hover:text-gray-300 focus:text-gray-300" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-6 h-6" /> {/* Icono de Twitter */}
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com" 
              className="transition-colors hover:text-gray-300 focus:text-gray-300" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-6 h-6" /> {/* Icono de Instagram */}
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/" 
              className="transition-colors hover:text-gray-300 focus:text-gray-300" // Estilo del enlace
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="w-6 h-6" /> {/* Icono de LinkedIn */}
            </a>
          </li>
        </ul>
      </div>

      <hr className="my-8 border-gray-700" /> {/* Línea de separación */}

      {/* Copyright */}
      <p className="text-center font-normal">
        &copy; 2024 Sushi & Burger Home
      </p>
    </footer>
  );
}

export default Footer;
