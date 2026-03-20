import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from Spring Boot when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load the product catalog.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means this runs exactly once on page load

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading catalog...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Latest Arrivals
      </h2>
      
      {/* Responsive Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Product Image */}
            <div className="h-64 bg-gray-200 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  // Fallback if the image link is broken
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            </div>
            
            {/* Product Details */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                {product.category}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                {product.name}
              </h3>
              <p className="text-xl font-extrabold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              
              <button className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products found in the catalog.</p>
      )}
    </div>
  );
};

export default ProductCatalog;