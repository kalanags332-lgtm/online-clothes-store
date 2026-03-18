import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { products } from '../data';
import './Cart.css';

export default function Cart() {
  // Mock cart data
  const cartItems = [
    { ...products[0], quantity: 2 },
    { ...products[3], quantity: 1 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-category">{item.category}</p>
                    </div>
                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button aria-label="Decrease"><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button aria-label="Increase"><Plus size={16} /></button>
                    </div>
                    <button className="remove-btn">
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary checkout-btn">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            
            <p className="secure-checkout">
              🔒 Secure Checkout - Free Returns
            </p>
          </aside>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <Link to="/products" className="btn btn-primary mt-4">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
