import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductId } from '../utils/productIdHelper';

const useCartStore = create(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],

      // Add item to cart
      addToCart: (product) => {
        const cartItems = get().cartItems;
        const productId = getProductId(product);
        const existingItem = cartItems.find(item => getProductId(item) === productId);

        if (existingItem) {
          // If item exists, increase quantity
          set({
            cartItems: cartItems.map(item =>
              getProductId(item) === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
          return { success: true, message: "Quantity updated in cart" };
        } else {
          // Add new item with quantity 1
          set({
            cartItems: [...cartItems, { ...product, quantity: 1 }]
          });
          return { success: true, message: "Added to cart" };
        }
      },

      // Remove item from cart
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter(item => getProductId(item) !== productId)
        });
        return { success: true, message: "Removed from cart" };
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          return get().removeFromCart(productId);
        }

        set({
          cartItems: get().cartItems.map(item =>
            getProductId(item) === productId
              ? { ...item, quantity: quantity }
              : item
          )
        });
        return { success: true, message: "Quantity updated" };
      },

      // Increase quantity by 1
      increaseQuantity: (productId) => {
        set({
          cartItems: get().cartItems.map(item =>
            getProductId(item) === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        });
      },

      // Decrease quantity by 1
      decreaseQuantity: (productId) => {
        const item = get().cartItems.find(item => getProductId(item) === productId);
        if (item && item.quantity > 1) {
          set({
            cartItems: get().cartItems.map(item =>
              getProductId(item) === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          });
        } else {
          // If quantity is 1, remove the item
          get().removeFromCart(productId);
        }
      },

      // Clear entire cart
      clearCart: () => {
        set({ cartItems: [] });
        return { success: true, message: "Cart cleared" };
      },

      // Get total items count
      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price
      getTotalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      },

      // Check if item is in cart
      isInCart: (productId) => {
        return get().cartItems.some(item => getProductId(item) === productId);
      },

      // Get item quantity
      getItemQuantity: (productId) => {
        const item = get().cartItems.find(item => getProductId(item) === productId);
        return item ? item.quantity : 0;
      }
    }),
    {
      name: 'shopping-cart', // Key in localStorage
      // Only persist cartItems
      partialize: (state) => ({ cartItems: state.cartItems })
    }
  )
);

export default useCartStore;
