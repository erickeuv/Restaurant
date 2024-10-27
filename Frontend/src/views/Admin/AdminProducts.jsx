import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image_url: '' });
  const [error, setError] = useState(null);
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
    } else {
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(response.data);
        } catch (error) {
          if (error.response?.status === 401) {
            setError('No estás autorizado para ver los productos. Inicia sesión nuevamente.');
          } else {
            setError('Error al obtener la lista de productos');
          }
        }
      };
      fetchProducts();
    }
  }, [userRole, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError('El nombre y el precio son obligatorios');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', category: '', description: '', image_url: '' });
      setError(null);
    } catch (error) {
      setError(error.response?.status === 403 ? 'No tienes permisos para añadir productos' : 'Error al añadir el producto');
    }
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/products/${productId}/toggle-active`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.map(product => 
        product.id === productId ? response.data : product
      ));
      setError(null);
    } catch (error) {
      setError(error.response?.status === 403 ? 'No tienes permisos para cambiar el estado del producto' : 'Error al cambiar el estado del producto');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Administrar Productos</h2>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Añadir Nuevo Producto</h3>
        <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Nombre" className="mb-2 p-2 border" />
        <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Precio" className="mb-2 p-2 border" />
        <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} placeholder="Categoría" className="mb-2 p-2 border" />
        <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Descripción" className="mb-2 p-2 border" />
        <input type="text" name="image_url" value={newProduct.image_url} onChange={handleInputChange} placeholder="URL de Imagen" className="mb-2 p-2 border" />
        <button onClick={handleAddProduct} className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300">Añadir Producto</button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Lista de Productos</h3>
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-4">
        {products.map(product => (
          <li
            key={product.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${!product.active ? 'bg-gray-200 text-gray-500' : ''}`}
          >
            <div>
              <p><strong>Nombre:</strong> {product.name}</p>
              <p><strong>Precio:</strong> ${product.price}</p>
              <p><strong>Estado:</strong> {product.active ? 'Activo' : 'Desactivado'}</p>
            </div>
            <button
              onClick={() => handleToggleProductStatus(product.id)}
              className={`px-4 py-2 ${product.active ? 'bg-red-500' : 'bg-green-500'} text-white rounded hover:bg-opacity-75`}
            >
              {product.active ? 'Desactivar' : 'Activar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
