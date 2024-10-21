import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Función para guardar el carrito en el backend (opcional)
    const saveCartToBackend = async () => {
        try {
            await axios.post(`${backendUrl}/api/carrito`, {
                items: cartItems.map(item => ({ productId: item.id, cantidad: item.quantity }))
            });
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    };

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
        saveCartToBackend(); // Guarda el carrito cada vez que se agrega un artículo
    };

    const removeItem = (itemToRemove) => {
        setCartItems((prevItems) => {
            const newItems = prevItems.filter((item) => item.id !== itemToRemove.id);
            saveCartToBackend(); // Guarda el carrito cada vez que se elimina un artículo
            return newItems;
        });
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
        saveCartToBackend(); // Guarda el carrito después de decrementar un artículo
    };

    const incrementItem = (itemToIncrement) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.id === itemToIncrement.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });
        saveCartToBackend(); // Guarda el carrito después de incrementar un artículo
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
