import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config'; 

const Cart = () => {
    const { cartItems, getTotal, clearCart, removeItem, decrementItem, incrementItem } = useContext(CartContext);
    const { isAuthenticated, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirige al login si no está autenticado
            return;
        }
    
        try {
            setIsProcessing(true);
    
            const purchaseData = {
                user_id: userId, // Solo enviar user_id si está autenticado
                cart: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                totalAmount: getTotal(),
            };
    
            await axios.post(`${API_URL}/compras`, purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            clearCart();
            alert('Compra registrada exitosamente');
            navigate('/profile');
        } catch (error) {
            console.error('Error al registrar la compra:', error);
            alert(error.response?.data?.error || 'Ocurrió un error al procesar la compra. Inténtalo de nuevo.');
        } finally {
            setIsProcessing(false);
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
                            disabled={isProcessing}
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
