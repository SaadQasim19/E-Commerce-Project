import User from "../models/user.model.js";
import { deleteFromCloudinary, extractPublicId } from "../Config/cloudinary.js";

// Upload/Update Avatar
export const uploadAvatar = async (req, res) => {
  try {
    console.log('📸 Avatar upload request from user:', req.user._id);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const oldPublicId = extractPublicId(user.avatar);
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
          console.log('✓ Old avatar deleted from Cloudinary');
        } catch (error) {
          console.error('Error deleting old avatar:', error);
          // Continue anyway
        }
      }
    }

    // Update user avatar with new Cloudinary URL
    user.avatar = req.file.path;
    await user.save();

    console.log('✓ Avatar updated successfully:', req.file.path);

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
      user: user,
    });
  } catch (error) {
    console.error("❌ Error uploading avatar:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload avatar",
    });
  }
};

// Delete Avatar
export const deleteAvatar = async (req, res) => {
  try {
    console.log('🗑️ Delete avatar request from user:', req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete from Cloudinary if exists
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
          console.log('✓ Avatar deleted from Cloudinary');
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error);
          // Continue anyway
        }
      }
    }

    // Remove avatar URL from user
    user.avatar = "";
    await user.save();

    console.log('✓ Avatar removed successfully');

    res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
      user: user,
    });
  } catch (error) {
    console.error("❌ Error deleting avatar:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete avatar",
    });
  }
};

// Get current user profile (with avatar)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user profile",
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log('✏️ Update profile request from user:', req.user._id);

    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    console.log('✓ Profile updated successfully');

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
