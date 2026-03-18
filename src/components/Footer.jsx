import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>✨ Aura</h3>
          <p>Elevating your everyday style with premium quality essentials.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Youtube"><Youtube size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">Sale</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Subscribe for exclusive offers and updates.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aura Clothing. All rights reserved.</p>
      </div>
    </footer>
  );
}
