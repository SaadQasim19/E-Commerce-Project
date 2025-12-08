// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Auth
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  ME: `${API_BASE_URL}/api/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/update-profile`,
  UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/update-password`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: (token) => `${API_BASE_URL}/api/auth/reset-password/${token}`,
  DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete-account`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_STATUS: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
  
  // Reviews
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  REVIEWS_BY_PRODUCT: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
  REVIEW_HELPFUL: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}/helpful`,
  
  // Settings
  SETTINGS: `${API_BASE_URL}/api/settings`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  UNREAD_COUNT: `${API_BASE_URL}/api/notifications/unread-count`,
  MARK_AS_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
  MARK_ALL_READ: `${API_BASE_URL}/api/notifications/mark-all-read`,
  DELETE_NOTIFICATION: (id) => `${API_BASE_URL}/api/notifications/${id}`,
  CLEAR_READ: `${API_BASE_URL}/api/notifications/clear-read/all`,
  
  // External Products (API Integration)
  EXTERNAL_PRODUCTS: `${API_BASE_URL}/api/external-products`,
};

export default API_BASE_URL;
