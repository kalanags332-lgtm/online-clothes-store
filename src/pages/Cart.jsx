import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  // We wait to show loading until the context has initialized
  useEffect(() => {
    if (cart !== undefined) {
      setIsLoading(false);
    }
  }, [cart]);

  const handleRemove = async (lineItemId) => {
    setIsLoading(true);
    const success = await removeFromCart(lineItemId);
    if (!success) {
      alert("Failed to remove item.");
    }
    // We can rely on context update to un-set isLoading
  };

  const handleCheckout = () => {
    alert("Checkout flow requires a live Medusa storefront redirect. Your cart ID is: " + cart?.id);
  }

  if (isLoading) {
    return <div className="container" style={{padding: '5rem', textAlign: 'center'}}><Loader className="animate-spin" /></div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page container animate-fade-in">
        <h1 className="cart-title">Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary mt-4">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const currencySymbol = cart.currency_code === 'eur' ? '€' : '$';

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <img src={item.thumbnail} alt={item.title} className="cart-item-image" style={{ width: '100px', borderRadius: '8px' }} />
              <div className="cart-item-details" style={{ flex: 1 }}>
                <h3>{item.title} - {item.variant_title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p className="cart-item-price" style={{ fontWeight: 'bold' }}>{currencySymbol}{item.unit_price}</p>
              </div>
              <button 
                 className="btn btn-secondary remove-btn" 
                 style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} 
                 onClick={() => handleRemove(item.id)}
                 aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary" style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
            <span>Subtotal</span>
            <span>{currencySymbol}{cart.item_subtotal || cart.subtotal}</span>
          </div>
          <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
