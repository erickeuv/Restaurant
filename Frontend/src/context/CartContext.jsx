import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    // URL del backend directamente
    const backendUrl = 'https://restaurant-jy3w.onrender.com/api';

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función para guardar el carrito en el backend
    const saveCartToBackend = async (token) => {
        try {
            await axios.post(`${backendUrl}/carrito`, {
                items: cartItems.map(item => ({ productId: item.id, cantidad: item.quantity }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Asegúrate de incluir el token
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    };

    // Llamar a saveCartToBackend cuando cambie cartItems
    useEffect(() => {
        if (cartItems.length > 0) {
            saveCartToBackend();
        }
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
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemToIncrement.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
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
