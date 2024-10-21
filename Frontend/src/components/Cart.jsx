import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Para verificar si el usuario está autenticado
import { useNavigate } from 'react-router-dom'; // Para redirigir si es necesario
import axios from 'axios';

const Cart = () => {
    const { cartItems, getTotal, clearCart, removeItem, decrementItem, incrementItem } = useContext(CartContext); // Asegúrate de que clearCart esté disponible aquí
    const { isAuthenticated, token } = useContext(AuthContext); // Obtener el token y el estado de autenticación
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!isAuthenticated) {
            // Redirigir a la página de login si el usuario no está autenticado
            navigate('/login');
            return;
        }

        try {
            // Verificar si el token es válido (puedes agregar un console.log para depurar)
            console.log("Token JWT:", token);

            // Enviar los detalles de la compra al backend
            const purchaseData = {
                cart: cartItems, // Incluye los artículos del carrito
                totalAmount: getTotal(), // Incluye el total
            };

            // Llamar a la API de compras para registrar la compra
            await axios.post('http://localhost:5001/api/compras', purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Enviar el token para autenticación
                    'Content-Type': 'application/json' // Asegúrate de que el content type es correcto
                }
            });

            // Limpiar el carrito después de la compra
            clearCart(); // Asegúrate de que esta función existe en CartContext

            // Redirigir al usuario a su historial de compras o mostrar un mensaje de éxito
            alert('Compra registrada exitosamente');
            navigate('/perfil'); // Redirigir al historial del perfil o mostrar algo
        } catch (error) {
            console.error('Error al registrar la compra:', error);
            alert('Ocurrió un error al procesar la compra');
        }
    };

    return (
        <div className="sticky top-48 bg-white shadow-lg rounded-lg p-4 m-4 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4">Carrito</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío</p>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item, index) => (
                            <li key={index} className="py-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <img 
                                        src={item.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={item.title} 
                                        className="w-12 h-12 object-cover rounded mr-4" 
                                    />
                                    <div>
                                        <span className="block font-semibold">{item.title}</span>
                                        <span className="text-sm text-gray-500 font-semibold">${Number(item.price).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {item.quantity === 1 ? (
                                        <>
                                            <button 
                                                onClick={() => removeItem(item)} 
                                                className="text-red-500 hover:text-red-700 mr-2"
                                            >
                                                🗑️
                                            </button>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => incrementItem(item)} 
                                                className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center transition-all"
                                            >
                                                +
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => decrementItem(item)} 
                                                className="text-red-500 hover:text-red-700 mr-2"
                                            >
                                                -
                                            </button>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => incrementItem(item)} 
                                                className="bg-slate-800 hover:bg-slate-700 text-white rounded-full h-8 w-8 flex items-center justify-center transition-all"
                                            >
                                                +
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Total: ${getTotal().toFixed(2)}</h3>
                        <button 
                            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded"
                            onClick={handlePayment} // Llamar a la función handlePayment al pagar
                        >
                            Pagar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
