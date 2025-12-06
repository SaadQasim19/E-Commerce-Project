import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce/avatars', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' }, // Auto-crop to face
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' }, // Auto format (webp for modern browsers)
    ],
  },
});

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicId = (url) => {
  if (!url) return null;
  
  // Extract public ID from Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/ecommerce/avatars/abc123.jpg
  // Should return: ecommerce/avatars/abc123
  
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
    // Get everything after 'upload' and version number
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    // Remove file extension
    return fullPath.replace(/\.[^/.]+$/, '');
  }
  
  return null;
};

export { cloudinary, upload };
export default upload;
