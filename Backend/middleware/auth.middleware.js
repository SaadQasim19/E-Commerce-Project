import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers (Bearer token) or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login to access this resource.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Token may be invalid.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired. Please login again.",
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in authentication",
    });
  }
};

// Middleware to restrict access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this resource.`,
      });
    }

    next();
  };
};

// Optional: Middleware to check if user is logged in (doesn't throw error)
export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch (error) {
        // Token invalid, but we don't throw error
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
