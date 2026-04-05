import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Loader } from 'lucide-react';
import { createCheckout } from '../lib/medusa';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const checkoutUrl = await createCheckout(cartItems);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Checkout failed. Please ensure your Shopify Storefront API token is valid.");
      }
    } catch (e) {
      console.error(e);
      alert("Error starting checkout.");
    }
    setIsCheckingOut(false);
  }

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="cart-title">Your Cart</h1>
      {/* Fallback mock UI for cart since we don't have global cart context in this demo */}
      <div className="empty-cart">
        <p>The cart logic is wired up to Shopify! Add a valid Storefront Token to test the checkout flow.</p>
        <button 
          className="btn btn-primary mt-4" 
          onClick={handleCheckout} 
          disabled={isCheckingOut}
        >
          {isCheckingOut ? <Loader className="animate-spin" size={18} /> : "Test Shopify Checkout Redirect"}
        </button>
      </div>
    </div>
  );
}
