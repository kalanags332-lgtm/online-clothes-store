import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card animate-fade-in">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button className="add-to-cart-btn" aria-label="Add to cart">
          <ShoppingCart size={18} />
          <span>Add</span>
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
