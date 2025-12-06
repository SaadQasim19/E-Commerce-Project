import express from "express";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markReviewHelpful,
  updateReviewStatus,
} from "../Controller/review_controller.js";

const router = express.Router();

// Create a new review
router.post("/", createReview);

// Get all reviews for a specific product
router.get("/product/:productId", getProductReviews);

// Get all reviews (admin)
router.get("/", getAllReviews);

// Get single review by ID
router.get("/:id", getReviewById);

// Update review
router.put("/:id", updateReview);

// Delete review
router.delete("/:id", deleteReview);

// Mark review as helpful/not helpful
router.patch("/:id/helpful", markReviewHelpful);

// Update review status (admin)
router.patch("/:id/status", updateReviewStatus);

export default router;
