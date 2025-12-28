// const express = require('express');
//& we had  added type : "module" in package.json , so we can use import instead of require.
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";

import { connectDB } from "./Config/db.js";
import { initializeSocket } from "./Config/socket.js";
import cors from 'cors';
import passportConfig from "./Config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from Backend directory
dotenv.config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || 5000;

// import productModel from "./models/product.model.js";
// import mongoose from "mongoose";
import productRoutes from "./Routes/product_routes.js";
import orderRoutes from "./Routes/order_routes.js";
import reviewRoutes from "./Routes/review_routes.js";
import authRoutes from "./Routes/auth_routes.js";
import socialAuthRoutes from "./Routes/social_auth_routes.js";
import settingsRoutes from "./Routes/settings_routes.js";
import uploadRoutes from "./Routes/upload_routes.js";
import notificationRoutes from "./Routes/notification_routes.js";
import promotionRoutes from "./Routes/promotion_routes.js";
import externalProductRoutes from "./Routes/externalProduct_routes.js";

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', //~ Frontend URL
  credentials: true, //~ Allow cookies to be sent
}));

//& Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//! Middleware
//~ Without this, req.body will be undefined.
//~ to parse incoming JSON requests and put the parsed data in -- req.body --
app.use(express.json());
app.use(cookieParser()); //~ Parse cookies

//* Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

//* Initialize Passport
app.use(passportConfig.initialize());
app.use(passportConfig.session());



//& This productRoutes can be any name.

//& /api/products is a base URL .it will be present in the URL even if we don't add it in the postman/router.
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", socialAuthRoutes); //& Social OAuth routes (Google, Facebook, GitHub)
app.use("/api/settings", settingsRoutes); //& Admin settings routes
app.use("/api/users", uploadRoutes); //& User profile & avatar upload routes
app.use("/api/notifications", notificationRoutes); //& Notification routes
app.use("/api/promotions", promotionRoutes); //& Promotional notification routes (Admin only)
app.use("/api/external-products", externalProductRoutes); //& External product API routes



//* Create HTTP server for Socket.IO
const httpServer = createServer(app);

//* Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  
  console.log('     E-Commerce Backend Server          ');

  
  connectDB();
  
  console.log(` Server running at http://localhost:${PORT}`);
  console.log(` Socket.IO enabled at ws://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n---------------------------------------------------\n');
});
