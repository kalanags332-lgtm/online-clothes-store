import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/medusa';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoreData() {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load products", error);
      }
      setIsLoading(false);
    }
    loadStoreData();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title animate-fade-in">Discover Your Signature Style</h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Explore our new collection of premium essentials designed for modern living.
            Elevate your wardrobe with K-Mart.
          </p>
          <div className="hero-cta animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/products" className="btn btn-primary">
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link to="/collections" className="btn btn-secondary">
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      <section className="categories container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {['Tops', 'Outerwear', 'Bottoms', 'Accessories'].map((cat, index) => (
            <Link to={`/products?category=${cat}`} key={cat} className="category-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="category-overlay"></div>
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/products" className="view-all">View All <ArrowRight size={16} /></Link>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
            <p>Loading from Medusa...</p>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
