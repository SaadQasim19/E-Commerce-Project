import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getCustomersWithOrders,
} from "../Controller/order_controller.js";

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get customers who have placed orders
router.get("/customers", getCustomersWithOrders);

// Get a single order by ID
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatus);

// Delete an order
router.delete("/:id", deleteOrder);

export default router;
