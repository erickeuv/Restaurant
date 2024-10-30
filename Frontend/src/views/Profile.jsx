import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Profile = () => {
  const { isAuthenticated, userRole, token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirige al login si no hay autenticación una vez que se verifica
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && token) {
        try {
          // Solicitar datos del perfil
          const userResponse = await axios.get(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(userResponse.data);

          // Solicitar historial de compras
          const purchasesResponse = await axios.get(`${API_URL}/compras/historial`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPurchaseHistory(purchasesResponse.data.length > 0 ? purchasesResponse.data : []);
        } catch (err) {
          setError(err.response?.data?.error || 'Error al obtener los datos del usuario');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token]);

  if (loading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Perfil de Usuario</h2>
      <div className="text-lg">
        <p><strong>Nombre:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      {userRole === 'admin' && (
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Administrar Productos
        </button>
      )}

      <h3 className="text-2xl font-semibold text-slate-800 mt-6">Historial de Compras</h3>
      {purchaseHistory.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {purchaseHistory.map((purchase) => (
            <li key={purchase.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="font-semibold">
                Compra ID: {purchase.id} - Fecha: {new Date(purchase.purchase_date).toLocaleDateString()}
              </p>
              <p className="font-semibold">Total: ${purchase.total_amount.toFixed(2)}</p> {/* Muestra el total de la compra */}
              <ul className="list-disc list-inside mt-2">
                {purchase.items.map(item => (
                  <li key={item.product_id} className="text-sm text-gray-700">
                    {item.product_name} - Cantidad: {item.quantity} - Precio: ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mt-4">No hay historial de compras.</p>
      )}
    </div>
  );
};

export default Profile;
