import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext'; // Para obtener el user_id si está autenticado

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userId, isAuthenticated } = useContext(AuthContext); // Obtener user_id y estado de autenticación
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar carrito en localStorage al cambiar cartItems
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función para guardar el carrito en el backend
    const saveCartToBackend = async () => {
        if (!isAuthenticated) return; // Solo guarda si el usuario está autenticado

        try {
            await axios.post(`${API_URL}/carrito`, {
                user_id: userId,
                items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
            });
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    };

    // Efecto para guardar el carrito en el backend cuando cartItems cambia
    useEffect(() => {
        saveCartToBackend();
    }, [cartItems]);

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
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, getTotal, decrementItem, incrementItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
