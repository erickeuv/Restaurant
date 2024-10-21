import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginImage from '../assets/img/Burger_Login.png';
import { AuthContext } from '../context/AuthContext'; // Importa el AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const { login } = useContext(AuthContext); // Usa el contexto para manejar el login
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password: contraseña, 
      });
      if (response.status === 200) {
        const token = response.data.token;
        login(token); 
        navigate('/profile'); // Cambiado a /profile
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      alert('Error al iniciar sesión: ' + (error.response?.data?.error || 'Error de conexión'));
    }
  };
  

  return (
    <section className="bg-white">
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen py-12 px-6 lg:px-8">
        <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-lg">
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg focus:ring-slate-800 focus:border-slate-800 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800">Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg focus:ring-slate-800 focus:border-slate-800 block w-full p-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Iniciar Sesión
              </button>
              <p className="text-sm font-light text-gray-500 text-center">
                ¿No tienes una cuenta? <Link to="/signup" className="font-medium text-slate-800 hover:underline">Regístrate aquí</Link>
              </p>
            </form>
          </div>
        </div>

        <div className="hidden lg:block lg:h-[400px] md:h-[300px] md:ml-4">
          <img src={LoginImage} className="w-full h-full object-cover rounded-lg" alt="Delicious Burger" />
        </div>
      </div>
    </section>
  );
}

export default Login;
