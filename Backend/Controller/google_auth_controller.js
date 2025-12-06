import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Unified OAuth callback handler
const handleOAuthCallback = async (req, res, provider) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${provider}_authentication_failed`
      );
    }

    const token = generateToken(req.user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.cookie("token", token, cookieOptions);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=${provider}`);
  } catch (error) {
    console.error(`${provider} callback error:`, error);
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${provider}_callback_failed`
    );
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  await handleOAuthCallback(req, res, 'google');
};

// @desc    Facebook OAuth callback
// @route   GET /api/auth/facebook/callback
// @access  Public
export const facebookCallback = async (req, res) => {
  await handleOAuthCallback(req, res, 'facebook');
};

// @desc    GitHub OAuth callback
// @route   GET /api/auth/github/callback
// @access  Public
export const githubCallback = async (req, res) => {
  await handleOAuthCallback(req, res, 'github');
};
