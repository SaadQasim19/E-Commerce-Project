import express from 'express';
import {
  getExternalProducts,
  getExternalCategories,
  searchExternalProducts,
  syncExternalProducts,
  getCombinedProducts,
  clearSyncedProducts,
} from '../Controller/externalProduct_controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * External Products Routes
 * Endpoints for fetching products from external APIs and syncing to database
 */

// Public routes - Fetch from APIs (no DB save)
router.get('/', getExternalProducts); // GET /api/external-products?source=all&category=electronics&limit=30
router.get('/categories', getExternalCategories); // GET /api/external-products/categories?source=all
router.get('/search', searchExternalProducts); // GET /api/external-products/search?q=laptop&limit=30
router.get('/combined', getCombinedProducts); // GET /api/external-products/combined?category=electronics&includeExternal=true

// Admin routes - Sync to database
router.post('/sync', protect, isAdmin, syncExternalProducts); // POST /api/external-products/sync {source, category, limit}
router.delete('/clear/:source', protect, isAdmin, clearSyncedProducts); // DELETE /api/external-products/clear/fakestore

export default router;
