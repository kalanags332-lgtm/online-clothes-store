import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="products-page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{activeCategory} Collections</h1>
        <p className="page-description">
          Showing {filteredProducts.length} results
        </p>
      </div>

      <div className="products-layout">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filters-toggle">
          <button className="btn btn-secondary">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">
              <SlidersHorizontal size={18} /> Categories
            </h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="products-main">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try adjusting your category filters to find what you're looking for.</p>
              <button className="btn btn-primary mt-4" onClick={() => setActiveCategory('All')}>
                View All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
