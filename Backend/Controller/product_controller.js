import productModel from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { createNotificationHelper } from "./notification_controller.js";
import socketService from "../services/socket.service.js";

//! GET PRODUCTS
export const getProducts = async (req, res) => {
  //   res.send("Hello World");
  try {
    const data = await productModel.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "Products fetched successfully",
        products: data,
      });
  } catch (error) {
    console.error("Error in fetching products", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

//! POST PRODUCTS
export const createProduct = async (req, res) => {
  const userProduct = req.body; //^ (body) data that we post on postman/client...
  
  console.log('📦 Create Product Request:', userProduct);
  
  if (!userProduct.name || !userProduct.price || !userProduct.image) {
    console.log('❌ Validation failed - Missing required fields');
    return res
      .status(400)
      .json({ success: false, message: "Required Fields are missing." });
  }

  const newProduct = new productModel(userProduct);
  try {
    await newProduct.save();
    console.log('✓ Product created successfully:', newProduct._id);
    res
      .status(201)
      .json({
        success: true,
        message: "Product Created Successfully",
        product: newProduct,
      });
  } catch (error) {
    console.error("❌ Error in creating product:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
}

//! PUT PRODUCTS
export const updateProduct = async (req, res) => {
  const { id: userProductId } = req.params;
  const userProduct = req.body;

  if (!mongoose.Types.ObjectId.isValid(userProductId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product Id" });
  }

  //^ userProductId is the id that we pass in url
  //^ userProduct is the data that we pass in body

  // Start session for transaction if updating quantity
  const session = userProduct.quantity !== undefined ? await mongoose.startSession() : null;

  try {
    let updatedProduct;

    if (session) {
      // Use transaction for stock updates
      await session.withTransaction(async () => {
        updatedProduct = await productModel.findByIdAndUpdate(
          userProductId,
          userProduct,
          { new: true, runValidators: true, session }
        );

        if (!updatedProduct) {
          throw new Error("Product not found");
        }

        // Check for low stock and notify admins
        const LOW_STOCK_THRESHOLD = 10;
        if (updatedProduct.quantity <= LOW_STOCK_THRESHOLD && updatedProduct.quantity > 0) {
          const admins = await User.find({ role: 'admin' }).session(session);
          for (const admin of admins) {
            await createNotificationHelper(
              admin._id,
              'product',
              '⚠️ Low Stock Alert',
              `Product "${updatedProduct.name}" has only ${updatedProduct.quantity} items left in stock!`,
              `/admin/products/${updatedProduct._id}`,
              'alert-triangle',
              'high'
            );
          }
          // Real-time low stock alert
          socketService.notifyLowStock(updatedProduct);
        }

        // Out of stock notification
        if (updatedProduct.quantity === 0) {
          const admins = await User.find({ role: 'admin' }).session(session);
          for (const admin of admins) {
            await createNotificationHelper(
              admin._id,
              'product',
              '🚨 Out of Stock',
              `Product "${updatedProduct.name}" is now out of stock!`,
              `/admin/products/${updatedProduct._id}`,
              'x-circle',
              'high'
            );
          }
          // Real-time out of stock alert
          socketService.notifyOutOfStock(updatedProduct);
        }
      });
    } else {
      // Simple update without transaction
      updatedProduct = await productModel.findByIdAndUpdate(
        userProductId,
        userProduct,
        { new: true, runValidators: true }
      );
    }

    // Broadcast product update to all clients
    socketService.broadcastProductUpdate(updatedProduct);

    res
      .status(200)
      .json({
        success: true,
        message: "Product Updated Successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error in updating product", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

//! DELETE PRODUCTS
export const deleteProduct =  async (req, res) => {
    const { id: userProductId } = req.params;
    //   const productId = req.params.id;                          //^ (params) id that we pass in url
    try {
      const deletedProduct = await productModel.findByIdAndDelete(userProductId);
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
        product: deletedProduct,
      });
    } catch (error) {
      console.error("Error in deleting product", error);
      res.status(500).json({ success: false, message: "Such Id Doesnot Exist" });
    }
  }