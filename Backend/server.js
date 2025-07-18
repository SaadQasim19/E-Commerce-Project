// const express = require('express');
//& we had  added type : "module" in package.json , so we can use import instead of require.
import express from "express";
import dotenv from "dotenv";


import { connectDB } from "./Config/db.js";
import cors from 'cors';


dotenv.config();
const PORT = process.env.PORT || 5000;

// import productModel from "./models/product.model.js";
// import mongoose from "mongoose";
import productRoutes from "./Routes/product_routes.js";

const app = express();
app.use(cors());


//! Middleware
//~ Without this, req.body will be undefined.
//~ to parse incoming JSON requests and put the parsed data in -- req.body --
app.use(express.json());



//& This productRoutes can be any name.

//& /api/products is a base URL .it will be present in the URL even if we don't add it in the postman/router.
app.use("/api/products", productRoutes);





app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port : http://localhost:"+ PORT);
});
