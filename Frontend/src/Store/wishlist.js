import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductId } from '../utils/productIdHelper';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // Initial state
      wishlistItems: [],

      // Add item to wishlist
      addToWishlist: (product) => {
        const wishlistItems = get().wishlistItems;
        const productId = getProductId(product);
        const existingItem = wishlistItems.find(item => getProductId(item) === productId);

        if (existingItem) {
          return { success: false, message: "Already in wishlist" };
        } else {
          set({
            wishlistItems: [...wishlistItems, product]
          });
          return { success: true, message: "Added to wishlist" };
        }
      },

      // Remove item from wishlist
      removeFromWishlist: (productId) => {
        set({
          wishlistItems: get().wishlistItems.filter(item => getProductId(item) !== productId)
        });
        return { success: true, message: "Removed from wishlist" };
      },

      // Toggle item in wishlist
      toggleWishlist: (product) => {
        const productId = getProductId(product);
        const isInWishlist = get().isInWishlist(productId);
        if (isInWishlist) {
          return get().removeFromWishlist(productId);
        } else {
          return get().addToWishlist(product);
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().wishlistItems.some(item => getProductId(item) === productId);
      },

      // Clear entire wishlist
      clearWishlist: () => {
        set({ wishlistItems: [] });
        return { success: true, message: "Wishlist cleared" };
      },

      // Get total items count
      getTotalItems: () => {
        return get().wishlistItems.length;
      },
    }),
    {
      name: 'wishlist-storage', // localStorage key
    }
  )
);

export default useWishlistStore;
