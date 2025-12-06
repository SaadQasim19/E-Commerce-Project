import express from "express";
import upload from "../Config/multer-local.js"; // Use local storage instead of Cloudinary
import {
  uploadAvatar,
  deleteAvatar,
  getUserProfile,
  updateUserProfile,
} from "../Controller/upload_controller_local.js"; // Use local storage controller
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get current user profile
router.get("/profile", getUserProfile);

// Update user profile (name, email, phone)
router.put("/profile", updateUserProfile);

// Upload/Update avatar (single file upload)
router.post("/avatar", upload.single('avatar'), uploadAvatar);

// Delete avatar
router.delete("/avatar", deleteAvatar);

export default router;
