import productModel from "../models/product.model.js";
import * as externalAPI from "../services/externalProductAPI.js";
import { createNotificationHelper } from "./notification_controller.js";
import User from "../models/user.model.js";

/**
 * External Products Controller
 * Handles fetching products from external APIs and syncing to database
 */

// @desc    Fetch products from external APIs (no DB save)
// @route   GET /api/external-products
// @access  Public
export const getExternalProducts = async (req, res) => {
  try {
    const { source, category, limit = 30 } = req.query;
    
    let products = [];
    
    switch (source) {
      case 'fakestore':
        products = await externalAPI.fetchFromFakeStore(category, parseInt(limit));
        break;
      case 'dummyjson':
        products = await externalAPI.fetchFromDummyJSON(category, parseInt(limit));
        break;
      case 'platzi':
        products = await externalAPI.fetchFromPlatzi(category, parseInt(limit));
        break;
      case 'all':
      default:
        products = await externalAPI.fetchFromAllSources(category, parseInt(limit));
        break;
    }
    
    res.status(200).json({
      success: true,
      count: products.length,
      source: source || 'all',
      products,
    });
  } catch (error) {
    console.error('Error fetching external products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching external products',
      error: error.message,
    });
  }
};

// @desc    Get all available categories from external APIs
// @route   GET /api/external-products/categories
// @access  Public
export const getExternalCategories = async (req, res) => {
  try {
    const { source } = req.query;
    
    let categories = [];
    
    switch (source) {
      case 'fakestore':
        categories = await externalAPI.getFakeStoreCategories();
        break;
      case 'dummyjson':
        categories = await externalAPI.getDummyJSONCategories();
        break;
      case 'platzi':
        categories = await externalAPI.getPlatziCategories();
        break;
      case 'all':
      default:
        categories = await externalAPI.getAllCategories();
        break;
    }
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// @desc    Search products from external APIs
// @route   GET /api/external-products/search
// @access  Public
export const searchExternalProducts = async (req, res) => {
  try {
    const { q, limit = 30 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }
    
    const products = await externalAPI.searchExternalProducts(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: products.length,
      query: q,
      products,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
    });
  }
};

// @desc    Sync products from external API to database (Admin only)
// @route   POST /api/external-products/sync
// @access  Admin
export const syncExternalProducts = async (req, res) => {
  try {
    const { source, category, limit = 50 } = req.body;
    
    if (!source) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a source (fakestore, dummyjson, platzi, or all)',
      });
    }
    
    let externalProducts = [];
    
    // Fetch from API
    switch (source) {
      case 'fakestore':
        externalProducts = await externalAPI.fetchFromFakeStore(category, parseInt(limit));
        break;
      case 'dummyjson':
        externalProducts = await externalAPI.fetchFromDummyJSON(category, parseInt(limit));
        break;
      case 'platzi':
        externalProducts = await externalAPI.fetchFromPlatzi(category, parseInt(limit));
        break;
      case 'all':
        externalProducts = await externalAPI.fetchFromAllSources(category, parseInt(limit));
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid source',
        });
    }
    
    // Sync to database
    const syncedProducts = [];
    const skippedProducts = [];
    
    for (const product of externalProducts) {
      try {
        // Check if product already exists by externalId
        const existingProduct = await productModel.findOne({ externalId: product.externalId });
        
        if (existingProduct) {
          skippedProducts.push(product.externalId);
          continue;
        }
        
        // Create new product
        const newProduct = await productModel.create({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: product.stock || 50,
          source: product.source,
          externalId: product.externalId,
          brand: product.brand,
          rating: product.rating,
          discount: product.discount || 0,
        });
        
        syncedProducts.push(newProduct);
      } catch (error) {
        console.error(`Error syncing product ${product.externalId}:`, error.message);
        skippedProducts.push(product.externalId);
      }
    }
    
    // Notify admins about sync
    if (syncedProducts.length > 0) {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await createNotificationHelper(
          admin._id,
          'product',
          '📦 Products Synced',
          `Successfully synced ${syncedProducts.length} products from ${source}`,
          '/admin/products',
          'download',
          'medium'
        );
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Synced ${syncedProducts.length} products, skipped ${skippedProducts.length}`,
      synced: syncedProducts.length,
      skipped: skippedProducts.length,
      products: syncedProducts,
    });
  } catch (error) {
    console.error('Error syncing products:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing products',
      error: error.message,
    });
  }
};

// @desc    Get combined products (manual + synced from APIs)
// @route   GET /api/products/combined
// @access  Public
export const getCombinedProducts = async (req, res) => {
  try {
    const { category, source, includeExternal = 'true', limit = 50 } = req.query;
    
    // Build query for database products
    const query = {};
    if (category) query.category = category;
    if (source && source !== 'all') query.source = source;
    
    // Get products from database
    const dbProducts = await productModel.find(query).limit(parseInt(limit));
    
    // Optionally fetch additional products from external APIs
    let combinedProducts = [...dbProducts];
    
    if (includeExternal === 'true') {
      const externalProducts = await externalAPI.fetchFromAllSources(category, 20);
      
      // Filter out products that already exist in DB
      const dbExternalIds = new Set(dbProducts.map(p => p.externalId).filter(Boolean));
      const newExternalProducts = externalProducts.filter(p => !dbExternalIds.has(p.externalId));
      
      combinedProducts = [...dbProducts, ...newExternalProducts];
    }
    
    res.status(200).json({
      success: true,
      count: combinedProducts.length,
      dbCount: dbProducts.length,
      products: combinedProducts,
    });
  } catch (error) {
    console.error('Error fetching combined products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// @desc    Delete all synced products from a specific source (Admin only)
// @route   DELETE /api/external-products/clear/:source
// @access  Admin
export const clearSyncedProducts = async (req, res) => {
  try {
    const { source } = req.params;
    
    if (!['fakestore', 'dummyjson', 'platzi', 'api', 'all'].includes(source)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source',
      });
    }
    
    const query = source === 'all' 
      ? { source: { $ne: 'manual' } }
      : { source };
    
    const result = await productModel.deleteMany(query);
    
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} products from ${source}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing synced products:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing synced products',
      error: error.message,
    });
  }
};

export default {
  getExternalProducts,
  getExternalCategories,
  searchExternalProducts,
  syncExternalProducts,
  getCombinedProducts,
  clearSyncedProducts,
};
