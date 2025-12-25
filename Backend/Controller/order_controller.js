import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { createNotificationHelper } from "./notification_controller.js";
import socketService from "../services/socket.service.js";

//* Create a new order with transaction support
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

  //* Start a MongoDB session for transaction
  const session = await mongoose.startSession();

  try {
    //* Start transaction (ACID)
    await session.withTransaction(async () => {
      //^ 1) Validate and reserve stock for all items
      for (const item of orderData.items) {
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }
//* Transaction is used*/
        //^ Decrement stock atomically
        const updateResult = await Product.updateOne(
          {
            _id: item.productId,
            quantity: { $gte: item.quantity } // Ensure stock hasn't changed
          },
          {
            $inc: { quantity: -item.quantity }
          },
          { session }
        );

        if (updateResult.modifiedCount === 0) {
          throw new Error(`Failed to reserve stock for ${product.name}. Please try again.`);
        }

        // Check for low stock after decrement
        const updatedProduct = await Product.findById(item.productId).session(session);
        const LOW_STOCK_THRESHOLD = 10;
        
        if (updatedProduct.quantity <= LOW_STOCK_THRESHOLD && updatedProduct.quantity > 0) {
          // Notify admins about low stock (real-time)
          socketService.notifyLowStock(updatedProduct);
        } else if (updatedProduct.quantity === 0) {
          // Notify admins about out of stock (real-time)
          socketService.notifyOutOfStock(updatedProduct);
        }
      }

      // 2) Create the order
      const [newOrder] = await Order.create([orderData], { session });

      // 3) Create notification for the user
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

        // Real-time notification to user
        socketService.notifyOrderCreated(newOrder, orderData.userId);
      }

      // 4) Notify admins about new order
      const User = (await import('../models/user.model.js')).default;
      const admins = await User.find({ role: 'admin' }).session(session);
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

      // Commit transaction (happens automatically with withTransaction)
      return newOrder;
    });

    // Transaction successful - get the created order
    const createdOrder = await Order.findOne({ userId: orderData.userId }).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    
    // Transaction automatically rolled back on error
    res.status(500).json({
      success: false,
      message: error.message || "Server Error: Failed to create order",
    });
  } finally {
    // End session
    session.endSession();
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

      // Real-time notification for order status change
      socketService.notifyOrderStatusChanged(updatedOrder);
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
