import React, { useState } from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = async () => {
    if (!product.variantId) return alert("No variant available for this product!");
    const success = await addToCart(product.variantId, 1);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert("Failed to add to cart. Check console.");
    }
  };

  return (
    <div className="product-card animate-fade-in">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button className={`add-to-cart-btn ${added ? 'added' : ''}`} aria-label="Add to cart" onClick={handleAdd}>
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          <span>{added ? 'Added!' : 'Add'}</span>
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
