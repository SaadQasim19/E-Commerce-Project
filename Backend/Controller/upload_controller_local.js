import User from "../models/user.model.js";
import { deleteLocalFile, extractFilename } from "../Config/multer-local.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload/Update Avatar (Local Storage)
export const uploadAvatar = async (req, res) => {
  try {
    console.log(' Avatar upload request from user:', req.user._id);

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

    // Delete old avatar file if exists and is local
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldFilePath = path.join(__dirname, '..', user.avatar);
      deleteLocalFile(oldFilePath);
    }

    // Update user avatar with new local file path (relative URL)
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    console.log('✓ Avatar updated successfully:', user.avatar);

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading avatar:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload avatar",
    });
  }
};

// Delete Avatar (Local Storage)
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

    // Delete local file if exists
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', user.avatar);
      deleteLocalFile(filePath);
    }

    // Remove avatar URL from user
    user.avatar = "";
    await user.save();

    console.log('✓ Avatar removed successfully');

    res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting avatar:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete avatar",
    });
  }
};

// Get User Profile
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
    console.error("Error getting user profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get user profile",
    });
  }
};

// Update User Profile (name, email, phone)
export const updateUserProfile = async (req, res) => {
  try {
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

    console.log('✓ User profile updated:', req.user._id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
