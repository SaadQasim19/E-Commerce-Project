import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// Create a new review
export const createReview = async (req, res) => {
  const { productId, userName, userEmail, rating, title, comment } = req.body;

  // Validate required fields
  if (!productId || !userName || !userEmail || !rating || !title || !comment) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Validate product exists
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const newReview = new Review({
      product: productId,
      userName,
      userEmail,
      rating,
      title,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to create review",
    });
  }
};

// Get all reviews for a specific product
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const reviews = await Review.find({ product: productId, status: "approved" })
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to fetch reviews",
    });
  }
};

// Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to fetch reviews",
    });
  }
};

// Get single review by ID
export const getReviewById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }

  try {
    const review = await Review.findById(id).populate("product", "name image price");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error fetching review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to fetch review",
    });
  }
};

// Update review (edit)
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, title, comment },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to update review",
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to delete review",
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  const { id } = req.params;
  const { helpful } = req.body; // true for helpful, false for not helpful

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }

  try {
    const update = helpful
      ? { $inc: { helpfulVotes: 1 } }
      : { $inc: { notHelpfulVotes: 1 } };

    const review = await Review.findByIdAndUpdate(id, update, { new: true });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: helpful ? "Marked as helpful" : "Marked as not helpful",
      review,
    });
  } catch (error) {
    console.error("Error updating helpful votes:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to update review",
    });
  }
};

// Update review status (admin only)
export const updateReviewStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      review,
    });
  } catch (error) {
    console.error("Error updating review status:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to update review status",
    });
  }
};
