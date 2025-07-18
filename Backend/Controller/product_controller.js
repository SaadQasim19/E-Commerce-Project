import productModel from "../models/product.model.js";


import mongoose from "mongoose";

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
  if (!userProduct.name || !userProduct.price || !userProduct.image) {
    return res
      .status(400)
      .json({ success: false, message: "Required Fields are missing." });
  }

  const newProduct = new productModel(userProduct);
  try {
    await newProduct.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Product Created Successfully",
        product: newProduct,
      });
  } catch (error) {
    console.error("Error in creating product", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
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

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      userProductId,
      userProduct,
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Product Updated Successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error in updating product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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