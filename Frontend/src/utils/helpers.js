// Utility functions for the application

/**
 * Get the full URL for an avatar image
 * @param {string} avatarPath - The avatar path from the database
 * @returns {string} - The full URL to the avatar image
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";
  
  // If it's already a full URL (e.g., from Cloudinary), return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // If it's a local path (starts with /uploads/), prepend the backend URL
  if (avatarPath.startsWith('/uploads/')) {
    return `http://localhost:5000${avatarPath}`;
  }
  
  // Default: return as is
  return avatarPath;
};

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
