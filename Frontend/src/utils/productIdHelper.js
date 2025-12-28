/**
 * Product ID Utility Helper
 * 
 * This module provides utility functions for handling product identifiers
 * across manual products (_id) and external products (externalId).
 */

/**
 * Get the unique identifier for a product
 * Priority: externalId > _id
 * 
 * @param {Object} product - Product object
 * @returns {string} - Unique product identifier
 */
export const getProductId = (product) => {
  if (!product) return null;
  return product.externalId || product._id;
};

/**
 * Check if two products are the same
 * 
 * @param {Object} product1 - First product
 * @param {Object} product2 - Second product
 * @returns {boolean} - True if products are the same
 */
export const isSameProduct = (product1, product2) => {
  if (!product1 || !product2) return false;
  const id1 = getProductId(product1);
  const id2 = getProductId(product2);
  return id1 === id2;
};

/**
 * Find a product in an array by ID
 * 
 * @param {Array} products - Array of products
 * @param {string} productId - Product ID to find
 * @returns {Object|undefined} - Found product or undefined
 */
export const findProductById = (products, productId) => {
  if (!products || !Array.isArray(products) || !productId) return undefined;
  return products.find(product => getProductId(product) === productId);
};

/**
 * Check if a product exists in an array
 * 
 * @param {Array} products - Array of products
 * @param {string} productId - Product ID to check
 * @returns {boolean} - True if product exists in array
 */
export const productExists = (products, productId) => {
  if (!products || !Array.isArray(products) || !productId) return false;
  return products.some(product => getProductId(product) === productId);
};
