import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from "../Controller/auth_controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Protected routes (require authentication)
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;
