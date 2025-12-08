import { create } from 'zustand';
import { API_ENDPOINTS } from '../config/api';

const ProductStore = create((set) => ({
  oldProduct: [],

  // Add product locally
  addProduct: (newProduct) => {
    set((state) => ({
      oldProduct: [...state.oldProduct, newProduct]
    }));
  },

  // Create product using async API call   
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Required fields are missing" };
    }

    try {
      console.log('Creating product:', newProduct);
      console.log('Sending to:', API_ENDPOINTS.PRODUCTS);
      
      const res = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct)
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to create product" };
      }

      set((state) => ({
        oldProduct: [...state.oldProduct, data.product]
      }));
      
      return { success: true, message: data.message || "Product created successfully" };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, message: error.message || "Network error - Cannot connect to server" };
    }
  },

  // Fetch products from API
  fetchProducts: async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();

      set({ oldProduct: data.products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  // Delete product
  deleteProducts: async (id) => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
//& Update local state after deletion
      set((state) => ({
        oldProduct: state.oldProduct.filter(product => product._id !== id)
      }));

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Error deleting product" };
    }
  },
  updateProducts: async (id, updateProduct) => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateProduct)
      });
  
      if (!res.ok) {
        throw new Error("Failed to update product");
      }
  
      const data = await res.json();
      set((state) => ({
        oldProduct: state.oldProduct.map(product =>
          product._id === id ? { ...product, ...data.product } : product
        )
      }));

      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: "Error updating product" };
    }
  },

  // Fetch external products from APIs (no DB save)
  fetchExternalProducts: async (source = 'all', category = '', limit = 30) => {
    try {
      const params = new URLSearchParams({
        source,
        ...(category && { category }),
        limit: limit.toString()
      });

      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}?${params}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch external products");
      }

      return { success: true, products: data.products, count: data.count };
    } catch (error) {
      console.error("Error fetching external products:", error);
      return { success: false, message: error.message, products: [] };
    }
  },

  // Get external categories
  fetchExternalCategories: async (source = 'all') => {
    try {
      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}/categories?source=${source}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return { success: true, categories: data.categories };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { success: false, message: error.message, categories: [] };
    }
  },

  // Search external products
  searchExternalProducts: async (query, limit = 30) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to search products");
      }

      return { success: true, products: data.products, count: data.count };
    } catch (error) {
      console.error("Error searching products:", error);
      return { success: false, message: error.message, products: [] };
    }
  },

  // Get combined products (manual + external)
  fetchCombinedProducts: async (category = '', includeExternal = true, limit = 50) => {
    try {
      const params = new URLSearchParams({
        ...(category && { category }),
        includeExternal: includeExternal.toString(),
        limit: limit.toString()
      });

      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}/combined?${params}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch combined products");
      }

      set({ oldProduct: data.products });
      return { success: true, products: data.products, dbCount: data.dbCount };
    } catch (error) {
      console.error("Error fetching combined products:", error);
      return { success: false, message: error.message, products: [] };
    }
  },

  // Admin: Sync external products to database
  syncExternalProducts: async (source, category = '', limit = 50, token) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ source, category, limit })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to sync products");
      }

      return { 
        success: true, 
        message: data.message,
        synced: data.synced,
        skipped: data.skipped 
      };
    } catch (error) {
      console.error("Error syncing products:", error);
      return { success: false, message: error.message };
    }
  },

  // Admin: Clear synced products
  clearSyncedProducts: async (source, token) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.EXTERNAL_PRODUCTS}/clear/${source}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to clear products");
      }

      return { 
        success: true, 
        message: data.message,
        deletedCount: data.deletedCount 
      };
    } catch (error) {
      console.error("Error clearing products:", error);
      return { success: false, message: error.message };
    }
  }
}));

export default ProductStore;
