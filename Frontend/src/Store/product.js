import { create } from 'zustand';

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
      const res = await fetch("http://localhost:8000/api/products", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct)
      });

      const data = await res.json();

      set((state) => ({
        oldProduct: [...state.oldProduct, data.product]
      }));
      

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error creating product" };
    }
  },

  // Fetch products from API
  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products");
      const data = await res.json();

      set({ oldProduct: data.products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  // Delete product
  deleteProducts: async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
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
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
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
  }
}));

export default ProductStore;
