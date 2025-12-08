import express from 'express';
import {
  broadcastPromotion,
  sendFlashSaleNotification,
  sendNewArrivalNotification,
  sendCouponNotification,
  sendTargetedPromotion,
} from '../Controller/promotion_controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.post('/broadcast', protect, isAdmin, broadcastPromotion);
router.post('/flash-sale', protect, isAdmin, sendFlashSaleNotification);
router.post('/new-arrival', protect, isAdmin, sendNewArrivalNotification);
router.post('/coupon', protect, isAdmin, sendCouponNotification);
router.post('/targeted', protect, isAdmin, sendTargetedPromotion);

export default router;
