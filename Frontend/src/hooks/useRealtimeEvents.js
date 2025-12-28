import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '@chakra-ui/react';

/**
 * Socket.IO event types
 */
export const SOCKET_EVENTS = {
  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  
  // Order events
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  
  // Product events
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  PRODUCT_LOW_STOCK: 'product:low_stock',
  PRODUCT_OUT_OF_STOCK: 'product:out_of_stock',
  
  // Review events
  REVIEW_CREATED: 'review:created',
  REVIEW_UPDATED: 'review:updated',
  
  // Promotion events
  PROMOTION_CREATED: 'promotion:created',
  PROMOTION_UPDATED: 'promotion:updated',
};

/**
 * Hook to listen for real-time notifications
 * @param {Function} onNotification - Callback when new notification arrives
 */
export const useRealtimeNotifications = (onNotification) => {
  const { socket, isConnected } = useSocket();
  const toast = useToast();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification) => {
      console.log('📬 New notification:', notification);
      
      // Call callback if provided
      if (onNotification) {
        onNotification(notification);
      }

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        status: getPriorityStatus(notification.priority),
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
    };
  }, [socket, isConnected, onNotification, toast]);
};

/**
 * Hook to listen for real-time order updates
 * @param {Function} onOrderUpdate - Callback when order is updated
 */
export const useRealtimeOrders = (onOrderUpdate) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOrderCreated = (order) => {
      console.log('🛍️ New order:', order);
      if (onOrderUpdate) onOrderUpdate('created', order);
    };

    const handleOrderStatusChanged = (order) => {
      console.log('📦 Order status changed:', order);
      if (onOrderUpdate) onOrderUpdate('status_changed', order);
    };

    socket.on(SOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleOrderStatusChanged);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleOrderStatusChanged);
    };
  }, [socket, isConnected, onOrderUpdate]);
};

/**
 * Hook to listen for real-time product updates
 * @param {Function} onProductUpdate - Callback when product is updated
 */
export const useRealtimeProducts = (onProductUpdate) => {
  const { socket, isConnected } = useSocket();
  const toast = useToast();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProductUpdated = (product) => {
      console.log('📦 Product updated:', product);
      if (onProductUpdate) onProductUpdate('updated', product);
    };

    const handleLowStock = (product) => {
      console.log('⚠️ Low stock:', product);
      toast({
        title: 'Low Stock Alert',
        description: `${product.name} has only ${product.stock} items left!`,
        status: 'warning',
        duration: 7000,
        isClosable: true,
      });
      if (onProductUpdate) onProductUpdate('low_stock', product);
    };

    const handleOutOfStock = (product) => {
      console.log('🚨 Out of stock:', product);
      toast({
        title: 'Out of Stock',
        description: `${product.name} is now out of stock!`,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      if (onProductUpdate) onProductUpdate('out_of_stock', product);
    };

    socket.on(SOCKET_EVENTS.PRODUCT_UPDATED, handleProductUpdated);
    socket.on(SOCKET_EVENTS.PRODUCT_LOW_STOCK, handleLowStock);
    socket.on(SOCKET_EVENTS.PRODUCT_OUT_OF_STOCK, handleOutOfStock);

    return () => {
      socket.off(SOCKET_EVENTS.PRODUCT_UPDATED, handleProductUpdated);
      socket.off(SOCKET_EVENTS.PRODUCT_LOW_STOCK, handleLowStock);
      socket.off(SOCKET_EVENTS.PRODUCT_OUT_OF_STOCK, handleOutOfStock);
    };
  }, [socket, isConnected, onProductUpdate, toast]);
};

/**
 * Hook to listen for real-time promotion updates
 * @param {Function} onPromotion - Callback when new promotion arrives
 */
export const useRealtimePromotions = (onPromotion) => {
  const { socket, isConnected } = useSocket();
  const toast = useToast();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handlePromotionCreated = (promotion) => {
      console.log('🎁 New promotion:', promotion);
      
      toast({
        title: promotion.title,
        description: promotion.message,
        status: 'success',
        duration: 8000,
        isClosable: true,
        position: 'top',
      });

      if (onPromotion) onPromotion(promotion);
    };

    socket.on(SOCKET_EVENTS.PROMOTION_CREATED, handlePromotionCreated);

    return () => {
      socket.off(SOCKET_EVENTS.PROMOTION_CREATED, handlePromotionCreated);
    };
  }, [socket, isConnected, onPromotion, toast]);
};

/**
 * Generic hook to listen for any socket event
 * @param {string} event - Event name to listen for
 * @param {Function} callback - Callback when event is received
 */
export const useSocketEvent = (event, callback) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !callback) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, isConnected, event, callback]);
};

// Helper to map priority to toast status
const getPriorityStatus = (priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'info';
  }
};
