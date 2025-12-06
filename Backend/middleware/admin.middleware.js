// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};

// Middleware to check if user is admin or the user themselves
export const isAdminOrSelf = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Allow if user is admin OR if they're accessing their own data
    const isOwnData = req.params.id === req.user._id.toString();
    
    if (req.user.role === "admin" || isOwnData) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    console.error("Error in isAdminOrSelf middleware:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};
