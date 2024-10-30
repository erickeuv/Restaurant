import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext para autenticación

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated, userId } = useContext(AuthContext); // Obtener isAuthenticated y userId del contexto de autenticación

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guarda el carrito en localStorage al cambiar cartItems
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función para guardar el carrito en el backend
    const saveCartToBackend = async () => {
        // Verifica que el usuario esté autenticado y que exista un userId
        if (!isAuthenticated || !userId) {
            console.log("Usuario no autenticado; no se guarda el carrito en el backend.");
            return;
        }
    
        try {
            await axios.post(`${API_URL}/carrito`, {
                user_id: userId,
                items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
            });
        } catch (error) {
            console.error('Error al guardar el carrito:', error.response?.data || error.message);
        }
    };

    // Llama a saveCartToBackend cuando cambien cartItems, isAuthenticated, o userId
    useEffect(() => {
        if (isAuthenticated && userId) saveCartToBackend();
    }, [cartItems, isAuthenticated, userId]);

    const addItem = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                        : cartItem
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeItem = (itemToRemove) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemToRemove.id));
    };

    const decrementItem = (itemToDecrement) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === itemToDecrement.id);
            
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map((item) =>
                    item.id === itemToDecrement.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter((item) => item.id !== itemToDecrement.id);
            }
        });
    };

    const incrementItem = (itemToIncrement) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.id === itemToIncrement.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems'); // Opcional: eliminar el carrito del localStorage
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, getTotal, decrementItem, incrementItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
