# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your e-commerce website.

## 🎯 What You Need to Do

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing one)
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it: "E-Commerce Auth" or similar
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "OAuth client ID"
   
5. **Configure OAuth Consent Screen** (if prompted)
   - Select "External" user type
   - Click "Create"
   - Fill in:
     - App name: "E-Commerce Store"
     - User support email: Your email
     - Developer contact email: Your email
   - Click "Save and Continue"
   - Skip the "Scopes" page (click "Save and Continue")
   - Add test users if needed (your email)
   - Click "Save and Continue"

6. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "E-Commerce Web Client"
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:5000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click "Create"

7. **Copy Your Credentials**
   - You'll see a popup with:
     - Client ID: (long string like `123456789-abc...googleusercontent.com`)
     - Client Secret: (shorter string like `GOCSPX-...`)
   - **IMPORTANT**: Copy both of these!

### Step 2: Update Backend .env File

Open `/Backend/.env` and replace the placeholders:

```env
# Replace these with your actual credentials from Google Cloud Console
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE

# These should already be correct
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start Both Servers

#### Backend (Terminal 1):
```bash
cd /home/saad/Desktop/DBProject/E-Commerce-Project
node Backend/server.js
```

#### Frontend (Terminal 2):
```bash
cd /home/saad/Desktop/DBProject/E-Commerce-Project/Frontend
npm run dev
```

### Step 4: Test Google Login

1. Open http://localhost:5173 in your browser
2. Click "Login" or "Sign Up"
3. Click the "Continue with Google" button
4. Select your Google account
5. Grant permissions
6. You should be redirected back and logged in!

## 🎨 Design Improvements Made

### Login & Signup Pages:
✅ **Google button is now prominent** - Full width, primary position
✅ **Facebook & GitHub disabled** - Marked as "coming soon" with reduced opacity
✅ **Better mobile experience** - Vertical stack layout prevents cramped buttons
✅ **Real Google logo** - Using FaGoogle with official red color (#EA4335)
✅ **Functional** - Clicking redirects to Google OAuth flow

## 🔧 How It Works

1. **User clicks "Continue with Google"**
   → Redirects to `http://localhost:5000/api/auth/google`

2. **Backend initiates OAuth with Google**
   → User sees Google's login screen

3. **User logs in and grants permission**
   → Google redirects to callback URL with auth code

4. **Backend receives callback**
   → Exchanges code for user profile
   → Creates/updates user in database
   → Generates JWT token

5. **User redirected to frontend**
   → Frontend receives token
   → Stores in localStorage via Zustand
   → User is logged in!

## 📁 Files Modified/Created

### Backend:
- ✅ `/Backend/Config/passport.js` - Passport Google OAuth strategy
- ✅ `/Backend/Controller/google_auth_controller.js` - Google auth handlers
- ✅ `/Backend/Routes/google_auth_routes.js` - Google OAuth routes
- ✅ `/Backend/models/user.model.js` - Added `googleId` field
- ✅ `/Backend/server.js` - Added session & passport middleware
- ✅ `/Backend/.env` - Added Google credentials (YOU NEED TO FILL IN)

### Frontend:
- ✅ `/Frontend/src/Pages/LoginPage.jsx` - Updated with functional Google button
- ✅ `/Frontend/src/Pages/SignupPage.jsx` - Updated with functional Google button
- ✅ `/Frontend/src/Pages/AuthCallbackPage.jsx` - Handles OAuth callback
- ✅ `/Frontend/src/Store/auth.js` - Added setToken & setUser methods
- ✅ `/Frontend/src/App.jsx` - Added /auth/callback route

## 🚨 Important Notes

1. **Security**: Never commit your `.env` file with real credentials to Git!
2. **Production**: When deploying, update redirect URIs in Google Console to your production domain
3. **Testing**: Use your own Google account for testing
4. **Facebook/GitHub**: Currently disabled - you can implement them later using similar patterns

## 🐛 Troubleshooting

### "Redirect URI mismatch" error:
- Make sure the callback URL in Google Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- No trailing slash!

### User not created:
- Check MongoDB connection
- Check backend console for errors
- Make sure user model has googleId field

### Token not stored:
- Check browser console for errors
- Verify AuthCallbackPage is receiving the token
- Check localStorage in browser DevTools

## ✨ Next Steps

After testing Google OAuth:
1. Implement Facebook OAuth (similar pattern)
2. Implement GitHub OAuth (similar pattern)
3. Add profile picture from Google to user avatar
4. Add email verification flow
5. Add "Link Account" feature for users who signed up with email

---

**Need help?** Check the browser console and backend terminal for error messages!
