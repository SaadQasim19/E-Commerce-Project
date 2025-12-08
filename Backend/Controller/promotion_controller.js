import User from '../models/user.model.js';
import { createNotificationHelper } from './notification_controller.js';

/**
 * Send promotional notification to all users
 * Can be used for flash sales, new arrivals, special offers, etc.
 */

// @desc    Send promotional notification to all users
// @route   POST /api/notifications/promotion/broadcast
// @access  Admin only
export const broadcastPromotion = async (req, res) => {
  try {
    const { title, message, link, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and message',
      });
    }

    // Get all non-admin users
    const users = await User.find({ role: { $ne: 'admin' } });

    // Create notifications for all users
    const notificationPromises = users.map(user =>
      createNotificationHelper(
        user._id,
        'promotion',
        title,
        message,
        link || '/products',
        'gift',
        priority || 'medium'
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `Promotional notification sent to ${users.length} users`,
      userCount: users.length,
    });
  } catch (error) {
    console.error('Error broadcasting promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending promotional notification',
      error: error.message,
    });
  }
};

// @desc    Send flash sale notification
// @route   POST /api/notifications/promotion/flash-sale
// @access  Admin only
export const sendFlashSaleNotification = async (req, res) => {
  try {
    const { discount, category, duration } = req.body;

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide discount percentage',
      });
    }

    const users = await User.find({ role: { $ne: 'admin' } });

    const title = `⚡ Flash Sale! ${discount}% OFF`;
    const message = category
      ? `Get ${discount}% off on ${category} for the next ${duration || '24'} hours!`
      : `Get ${discount}% off on selected items for the next ${duration || '24'} hours!`;
    const link = category ? `/products?category=${category}` : '/products';

    const notificationPromises = users.map(user =>
      createNotificationHelper(
        user._id,
        'promotion',
        title,
        message,
        link,
        'zap',
        'high'
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `Flash sale notification sent to ${users.length} users`,
      userCount: users.length,
    });
  } catch (error) {
    console.error('Error sending flash sale:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending flash sale notification',
      error: error.message,
    });
  }
};

// @desc    Send new arrival notification
// @route   POST /api/notifications/promotion/new-arrival
// @access  Admin only
export const sendNewArrivalNotification = async (req, res) => {
  try {
    const { productName, category, productId } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name',
      });
    }

    const users = await User.find({ role: { $ne: 'admin' } });

    const title = '🆕 New Arrival!';
    const message = category
      ? `Check out our new ${category} product: ${productName}`
      : `New product just arrived: ${productName}`;
    const link = productId ? `/products/${productId}` : '/products';

    const notificationPromises = users.map(user =>
      createNotificationHelper(
        user._id,
        'promotion',
        title,
        message,
        link,
        'package',
        'medium'
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `New arrival notification sent to ${users.length} users`,
      userCount: users.length,
    });
  } catch (error) {
    console.error('Error sending new arrival notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending new arrival notification',
      error: error.message,
    });
  }
};

// @desc    Send coupon code notification
// @route   POST /api/notifications/promotion/coupon
// @access  Admin only
export const sendCouponNotification = async (req, res) => {
  try {
    const { code, discount, expiryDays, minPurchase } = req.body;

    if (!code || !discount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and discount',
      });
    }

    const users = await User.find({ role: { $ne: 'admin' } });

    const title = `🎟️ Exclusive Coupon: ${code}`;
    let message = `Use code "${code}" to get ${discount}% off`;
    if (minPurchase) {
      message += ` on orders over $${minPurchase}`;
    }
    if (expiryDays) {
      message += `. Valid for ${expiryDays} days!`;
    }

    const notificationPromises = users.map(user =>
      createNotificationHelper(
        user._id,
        'promotion',
        title,
        message,
        '/products',
        'gift',
        'high'
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `Coupon notification sent to ${users.length} users`,
      userCount: users.length,
    });
  } catch (error) {
    console.error('Error sending coupon notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending coupon notification',
      error: error.message,
    });
  }
};

// @desc    Send targeted notification to specific users
// @route   POST /api/notifications/promotion/targeted
// @access  Admin only
export const sendTargetedPromotion = async (req, res) => {
  try {
    const { userIds, title, message, link } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide array of user IDs',
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and message',
      });
    }

    const notificationPromises = userIds.map(userId =>
      createNotificationHelper(
        userId,
        'promotion',
        title,
        message,
        link || '/products',
        'gift',
        'medium'
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `Targeted promotion sent to ${userIds.length} users`,
      userCount: userIds.length,
    });
  } catch (error) {
    console.error('Error sending targeted promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending targeted promotion',
      error: error.message,
    });
  }
};
