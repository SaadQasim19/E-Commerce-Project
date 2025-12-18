import { emitToUser, emitToAdmins, emitToAll } from "../Config/socket.js";

/**
 * Real-time event types
 */
export const EVENTS = {
  // Notification events
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_DELETED: "notification:deleted",
  
  // Order events
  ORDER_CREATED: "order:created",
  ORDER_UPDATED: "order:updated",
  ORDER_STATUS_CHANGED: "order:status_changed",
  
  // Product events
  PRODUCT_CREATED: "product:created",
  PRODUCT_UPDATED: "product:updated",
  PRODUCT_DELETED: "product:deleted",
  PRODUCT_LOW_STOCK: "product:low_stock",
  PRODUCT_OUT_OF_STOCK: "product:out_of_stock",
  
  // Review events
  REVIEW_CREATED: "review:created",
  REVIEW_UPDATED: "review:updated",
  
  // Promotion events
  PROMOTION_CREATED: "promotion:created",
  PROMOTION_UPDATED: "promotion:updated",
};

/**
 * Socket.IO service for emitting real-time events
 */
class SocketService {
  /**
   * Emit new notification to user
   */
  notifyUser(userId, notification) {
    emitToUser(userId, EVENTS.NOTIFICATION_NEW, notification);
  }

  /**
   * Notify admins about new order
   */
  notifyOrderCreated(order, userId) {
    // Notify user
    emitToUser(userId, EVENTS.ORDER_CREATED, order);
    
    // Notify admins
    emitToAdmins(EVENTS.ORDER_CREATED, {
      orderId: order._id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });
  }

  /**
   * Notify user and admins about order status change
   */
  notifyOrderStatusChanged(order) {
    // Notify user
    emitToUser(order.userId.toString(), EVENTS.ORDER_STATUS_CHANGED, {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    });
    
    // Notify admins
    emitToAdmins(EVENTS.ORDER_UPDATED, {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    });
  }

  /**
   * Notify admins about low stock
   */
  notifyLowStock(product) {
    emitToAdmins(EVENTS.PRODUCT_LOW_STOCK, {
      productId: product._id,
      name: product.name,
      stock: product.stock,
      category: product.category,
    });
  }

  /**
   * Notify admins about out of stock
   */
  notifyOutOfStock(product) {
    emitToAdmins(EVENTS.PRODUCT_OUT_OF_STOCK, {
      productId: product._id,
      name: product.name,
      category: product.category,
    });
  }

  /**
   * Notify all users about new promotion
   */
  notifyPromotionCreated(promotion) {
    emitToAll(EVENTS.PROMOTION_CREATED, {
      title: promotion.title,
      message: promotion.message,
      type: promotion.type,
      validUntil: promotion.validUntil,
    });
  }

  /**
   * Notify user about new review on their product
   */
  notifyReviewCreated(review, productOwnerId) {
    if (productOwnerId) {
      emitToUser(productOwnerId.toString(), EVENTS.REVIEW_CREATED, {
        reviewId: review._id,
        productId: review.productId,
        rating: review.rating,
        comment: review.comment,
      });
    }
    
    // Notify admins
    emitToAdmins(EVENTS.REVIEW_CREATED, {
      reviewId: review._id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
    });
  }

  /**
   * Broadcast product update to all clients
   */
  broadcastProductUpdate(product) {
    emitToAll(EVENTS.PRODUCT_UPDATED, {
      productId: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }
}

export default new SocketService();
