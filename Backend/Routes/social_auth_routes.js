import express from "express";
import passport from "passport";
import {
  googleCallback,
  facebookCallback,
  githubCallback,
} from "../Controller/google_auth_controller.js";

const router = express.Router();

// Helper function to check if credentials are valid (not placeholders)
const isValidCredential = (value) => {
  return value && 
         value.trim() !== '' && 
         !value.includes('your_') && 
         !value.includes('_here');
};

// Check which OAuth providers are configured
const isGoogleConfigured = isValidCredential(process.env.GOOGLE_CLIENT_ID) && 
                           isValidCredential(process.env.GOOGLE_CLIENT_SECRET);
const isFacebookConfigured = isValidCredential(process.env.FACEBOOK_APP_ID) && 
                             isValidCredential(process.env.FACEBOOK_APP_SECRET);
const isGitHubConfigured = isValidCredential(process.env.GITHUB_CLIENT_ID) && 
                           isValidCredential(process.env.GITHUB_CLIENT_SECRET);

// Middleware to handle unavailable OAuth strategies
const oauthNotConfigured = (provider) => (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(`${frontendUrl}/login?error=${provider}_not_configured&message=${provider}%20login%20is%20not%20configured%20on%20this%20server`);
};

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  "/google",
  isGoogleConfigured 
    ? passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    : oauthNotConfigured('Google')
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  isGoogleConfigured
    ? passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
        session: false,
      })
    : oauthNotConfigured('Google'),
  isGoogleConfigured ? googleCallback : (req, res) => {}
);

// ============================================
// FACEBOOK OAUTH ROUTES
// ============================================

// @route   GET /api/auth/facebook
// @desc    Initiate Facebook OAuth
// @access  Public
router.get(
  "/facebook",
  isFacebookConfigured
    ? passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
      })
    : oauthNotConfigured('Facebook')
);

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get(
  "/facebook/callback",
  isFacebookConfigured
    ? passport.authenticate("facebook", {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=facebook_auth_failed`,
        session: false,
      })
    : oauthNotConfigured('Facebook'),
  isFacebookConfigured ? facebookCallback : (req, res) => {}
);

// ============================================
// GITHUB OAUTH ROUTES
// ============================================

// @route   GET /api/auth/github
// @desc    Initiate GitHub OAuth
// @access  Public
router.get(
  "/github",
  isGitHubConfigured
    ? passport.authenticate("github", {
        scope: ["user:email"],
      })
    : oauthNotConfigured('GitHub')
);

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
// @access  Public
router.get(
  "/github/callback",
  isGitHubConfigured
    ? passport.authenticate("github", {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_auth_failed`,
        session: false,
      })
    : oauthNotConfigured('GitHub'),
  isGitHubConfigured ? githubCallback : (req, res) => {}
);

export default router;
