import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user } = useUser();

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
          <form className="search-form" onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.search.value;
            if (query) navigate(`/products?q=${encodeURIComponent(query)}`);
          }} style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '20px', padding: '0.2rem 0.8rem' }}>
            <Search size={16} color="#6b7280" />
            <input 
              name="search" 
              type="text" 
              placeholder="Search products..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.5rem', width: '120px', fontSize: '0.9rem' }} 
            />
          </form>
          <Link to="/account" className="icon-btn" aria-label="Account">
            <User size={20} color={user ? '#3b82f6' : 'currentColor'} />
          </Link>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
