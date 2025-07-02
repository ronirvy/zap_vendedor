'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/models/Product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async (query: string = '') => {
    try {
      setLoading(true);
      const url = query ? `/api/products?search=${encodeURIComponent(query)}` : '/api/products';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Remove product from state
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link href="/admin/products/new">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Product
          </button>
        </Link>
      </div>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-grow px-4 py-2 border rounded-l"
          />
          <button 
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <>
          {/* Products table */}
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border text-left">Name</th>
                    <th className="py-2 px-4 border text-left">Category</th>
                    <th className="py-2 px-4 border text-left">Brand</th>
                    <th className="py-2 px-4 border text-right">Price</th>
                    <th className="py-2 px-4 border text-right">Stock</th>
                    <th className="py-2 px-4 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{product.name}</td>
                      <td className="py-2 px-4 border">{product.category}</td>
                      <td className="py-2 px-4 border">{product.brand}</td>
                      <td className="py-2 px-4 border text-right">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border text-right">{product.stock}</td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">No products found.</div>
          )}
        </>
      )}
    </div>
  );
}