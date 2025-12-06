import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // User information (for now without auth)
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Review title (short summary)
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    // Review comment (detailed feedback)
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    // Helpful votes
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
    },
    // Review status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Auto-approve for now
    },
    // Verified purchase (can be added later)
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Virtual for review age
reviewSchema.virtual("reviewAge").get(function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Include virtuals in JSON
reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
