import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">✨</span> K-Mart
        </Link>
        
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products')}`} onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/collections" className={`nav-link ${isActive('/collections')}`} onClick={() => setIsOpen(false)}>Collections</Link>
        </div>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search"><Search size={20} /></button>
          <button className="icon-btn" aria-label="Account"><User size={20} /></button>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            <span className="cart-badge">3</span>
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
