import Order from "../models/order.model.js";
import mongoose from "mongoose";
import { createNotificationHelper } from "./notification_controller.js";

// Create a new order
export const createOrder = async (req, res) => {
  const orderData = req.body;

  // Validate required fields
  if (
    !orderData.items ||
    !orderData.shippingInfo ||
    !orderData.paymentInfo ||
    !orderData.totalAmount
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required order information",
    });
  }

  // Validate items array
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order must contain at least one item",
    });
  }

  try {
    const newOrder = new Order(orderData);
    await newOrder.save();

    // Create notification for the user
    if (orderData.userId) {
      await createNotificationHelper(
        orderData.userId,
        'order',
        'Order Placed Successfully',
        `Your order #${newOrder._id.toString().slice(-6)} has been placed and is being processed.`,
        `/orders/${newOrder._id}`,
        'shopping-cart',
        'high'
      );
    }

    // Notify admins about new order
    const User = (await import('../models/user.model.js')).default;
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotificationHelper(
        admin._id,
        'order',
        '🛍️ New Order Received',
        `Order #${newOrder._id.toString().slice(-6)} placed for $${orderData.totalAmount.toFixed(2)}`,
        `/admin/orders/${newOrder._id}`,
        'shopping-bag',
        'high'
      );
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to create order",
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to fetch orders",
    });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Order ID",
    });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to fetch order",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Order ID",
    });
  }

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be one of: " + validStatuses.join(", "),
    });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Create notification for order status update
    if (updatedOrder.userId) {
      const statusMessages = {
        processing: 'Your order is now being processed.',
        shipped: 'Great news! Your order has been shipped.',
        delivered: 'Your order has been delivered. Thank you for shopping with us!',
        cancelled: 'Your order has been cancelled.',
      };

      const message = statusMessages[status] || `Your order status has been updated to ${status}.`;
      
      await createNotificationHelper(
        updatedOrder.userId,
        'order',
        'Order Status Updated',
        `Order #${updatedOrder._id.toString().slice(-6)}: ${message}`,
        `/orders/${updatedOrder._id}`,
        'package',
        status === 'delivered' ? 'high' : 'medium'
      );
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to update order",
    });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Order ID",
    });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Failed to delete order",
    });
  }
};
