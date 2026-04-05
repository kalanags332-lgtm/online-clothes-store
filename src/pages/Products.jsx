import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/medusa';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoreData() {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
        setProducts([]);
      }
      setIsLoading(false);
    }
    loadStoreData();
  }, []);

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="products-page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{activeCategory} Collections</h1>
        <p className="page-description">
          Showing {isLoading ? '...' : filteredProducts.length} results
        </p>
      </div>

      <div className="products-layout">
        <div className="mobile-filters-toggle">
          <button className="btn btn-secondary">
            <Filter size={18} /> Filters
          </button>
        </div>

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

        <main className="products-main">
          {isLoading ? (
            <div className="empty-state">
               <Loader className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
               <p>Loading catalog from Medusa...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
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
              <p>There are no products in this category on your store.</p>
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
