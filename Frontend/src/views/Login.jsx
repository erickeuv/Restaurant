import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginImage from '../assets/img/Burger_Login.png';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password: contraseña,
      });
      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        navigate('/profile');
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Credenciales incorrectas. Por favor, intenta nuevamente.');
      } else if (error.response?.status === 500) {
        alert('Error del servidor. Intenta más tarde.');
      } else {
        alert('Error al iniciar sesión: ' + (error.response?.data?.error || 'Error de conexión'));
      }
    } finally {
      setLoading(false);
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg focus:ring-slate-800 focus:border-slate-800 block w-full p-2.5"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
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
