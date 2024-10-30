import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Para verificar si el usuario está autenticado
import { useNavigate } from 'react-router-dom'; // Para redirigir si es necesario
import axios from 'axios';
import { API_URL } from '../config'; 

const Cart = () => {
    const { cartItems, getTotal, clearCart, removeItem, decrementItem, incrementItem } = useContext(CartContext); // Asegúrate de que clearCart esté disponible aquí
    const { isAuthenticated, token } = useContext(AuthContext); // Obtener el token y el estado de autenticación
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false); // Nuevo estado para evitar pagos duplicados

    const handlePayment = async () => {
        if (!isAuthenticated) {
            // Redirigir a la página de login si el usuario no está autenticado
            navigate('/login');
            return;
        }

        try {
            setIsProcessing(true); // Evitar múltiples clics en "Pagar"


            // Enviar los detalles de la compra al backend
            const purchaseData = {
                cart: cartItems, // Incluye los artículos del carrito
                totalAmount: getTotal(), // Incluye el total
            };

            // Llamar a la API de compras para registrar la compra
            await axios.post(`${API_URL}/compras`, purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Enviar el token para autenticación
                    'Content-Type': 'application/json' // Asegúrate de que el content type es correcto
                }
            });

            // Limpiar el carrito después de la compra
            clearCart();

            // Mostrar un mensaje de éxito o redirigir al historial de compras
            alert('Compra registrada exitosamente');
            navigate('/profile'); // Opcional: redirigir al perfil o historial de compras
        } catch (error) {
            console.error('Error al registrar la compra:', error);
            alert('Ocurrió un error al procesar la compra');
        } finally {
            setIsProcessing(false); // Permitir pagos nuevamente después de procesar
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

                                    <div>
                                        <span className="block font-semibold">{item.name}</span>
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
                            onClick={handlePayment} 
                            disabled={isProcessing} // Deshabilitar el botón durante el procesamiento
                        >
                            {isProcessing ? 'Procesando...' : 'Pagar'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
