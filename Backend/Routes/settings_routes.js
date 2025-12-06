import express from "express";
import {
  getSettings,
  updateStoreInfo,
  updateGeneralSettings,
  updatePaymentSettings,
  updateShippingSettings,
  updateEmailSettings,
  updateSEOSettings,
  updateSocialMedia,
  resetSettings,
} from "../Controller/settings_controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, isAdmin);

// Get all settings
router.get("/", getSettings);

// Update specific setting sections
router.put("/store-info", updateStoreInfo);
router.put("/general", updateGeneralSettings);
router.put("/payment", updatePaymentSettings);
router.put("/shipping", updateShippingSettings);
router.put("/email", updateEmailSettings);
router.put("/seo", updateSEOSettings);
router.put("/social-media", updateSocialMedia);

// Reset to default settings
router.post("/reset", resetSettings);

export default router;
