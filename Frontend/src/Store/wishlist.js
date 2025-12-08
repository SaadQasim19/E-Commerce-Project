import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // Initial state
      wishlistItems: [],

      // Add item to wishlist
      addToWishlist: (product) => {
        const wishlistItems = get().wishlistItems;
        const existingItem = wishlistItems.find(
          item => item._id === product._id || 
          (item.externalId && item.externalId === product.externalId)
        );

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
          wishlistItems: get().wishlistItems.filter(
            item => item._id !== productId && item.externalId !== productId
          )
        });
        return { success: true, message: "Removed from wishlist" };
      },

      // Toggle item in wishlist
      toggleWishlist: (product) => {
        const isInWishlist = get().isInWishlist(product._id || product.externalId);
        if (isInWishlist) {
          return get().removeFromWishlist(product._id || product.externalId);
        } else {
          return get().addToWishlist(product);
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().wishlistItems.some(
          item => item._id === productId || item.externalId === productId
        );
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
