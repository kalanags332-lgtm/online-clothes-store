import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as medusaAddToCart, removeFromCart as medusaRemoveFromCart } from '../lib/medusa';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  // Helper to fetch the latest cart from Medusa
  const refreshCart = async () => {
    const fetchedCart = await getCart();
    setCart(fetchedCart);
  };

  // Initial load
  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (variantId, quantity = 1) => {
    const success = await medusaAddToCart(variantId, quantity);
    if (success) {
      await refreshCart();
    }
    return success;
  };

  const removeFromCart = async (lineItemId) => {
    const success = await medusaRemoveFromCart(lineItemId);
    if (success) {
      await refreshCart();
    }
    return success;
  };

  // Calculate total item quantity in cart
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, addToCart, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
