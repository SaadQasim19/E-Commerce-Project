import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      // Checkout step state
      currentStep: 0,
      
      // Shipping information
      shippingInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "USA",
      },
      
      // Payment information
      paymentMethod: "card", // card, paypal, cod
      
      // Order details
      orderData: null,
      
      // Loading states
      isPlacingOrder: false,
      orderError: null,

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Update shipping info
      setShippingInfo: (info) => set({ shippingInfo: { ...get().shippingInfo, ...info } }),

      // Set payment method
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      // Calculate order totals
      calculateTotals: (cartItems) => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const totalAmount = subtotal + tax + shippingCost;
        
        return {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          shippingCost: parseFloat(shippingCost.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
        };
      },

      // Place order
      placeOrder: async (cartItems) => {
        set({ isPlacingOrder: true, orderError: null });
        
        try {
          const { shippingInfo, paymentMethod } = get();
          const totals = get().calculateTotals(cartItems);
          
          // Prepare order data
          const orderPayload = {
            items: cartItems.map(item => ({
              product: item._id || item.externalId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            shippingInfo,
            paymentInfo: {
              method: paymentMethod,
            },
            totalAmount: totals.totalAmount,
            subtotal: totals.subtotal,
            tax: totals.tax,
            shippingCost: totals.shippingCost,
          };

          const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
          });

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.message || "Failed to place order");
          }

          set({ 
            orderData: data.order, 
            isPlacingOrder: false,
            currentStep: 3 // Move to confirmation step
          });

          return { success: true, order: data.order };
        } catch (error) {
          set({ 
            isPlacingOrder: false, 
            orderError: error.message 
          });
          return { success: false, message: error.message };
        }
      },

      // Get order by ID
      getOrderById: async (orderId) => {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.message || "Failed to fetch order");
          }

          return { success: true, order: data.data };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Reset checkout
      resetCheckout: () => set({
        currentStep: 0,
        shippingInfo: {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "USA",
        },
        paymentMethod: "card",
        orderData: null,
        isPlacingOrder: false,
        orderError: null,
      }),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        shippingInfo: state.shippingInfo, // Persist shipping info for convenience
      }),
    }
  )
);

export default useCheckoutStore;
