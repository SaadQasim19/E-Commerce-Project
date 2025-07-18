//* separately adding routes for products to maintain the code clean.

import express from "express";
const router = express.Router();
import {  getProducts, createProduct, updateProduct , deleteProduct} from "../Controller/product_controller.js";

//^ ----------------- ROUTES -----------------


//! GET METHOD
//& now path would be http://localhost:8000/api/products/hello
router.get("/hello", (req,res)=> res.send("Hello World"));
router.get("/", getProducts);

//! POST METHOD

router.post("/", createProduct);

//! PUT METHOD

router.put("/:id",updateProduct );

//! Delete Product

router.delete("/:id", deleteProduct);

export default router;
