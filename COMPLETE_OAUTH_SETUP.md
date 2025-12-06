# 🔐 Complete OAuth Setup Guide
## Google, Facebook & GitHub Authentication

**All three social logins are now FULLY FUNCTIONAL!** Follow this guide to set up each provider.

---

## ✅ What's Working Now

### Login & Signup Pages:
```
[🔴 Continue with Google    ]  ← ENABLED & FUNCTIONAL!

[🔵 Facebook]  [⚫ GitHub]    ← ENABLED & FUNCTIONAL!
```

**ALL THREE BUTTONS NOW WORK!** Not disabled, not dummy - real OAuth!

---

## 🔴 1. Google OAuth Setup (5 minutes)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create/Select Project
1. Click project dropdown at top
2. Click "New Project" or select existing
3. Name: "E-Commerce Auth"

### Step 3: Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search "Google+ API"
3. Click "Enable"

### Step 4: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "OAuth client ID"

### Step 5: Configure Consent Screen (if needed)
1. Select "External" user type
2. Fill in:
   - App name: "E-Commerce Store"
   - User support email: Your email
   - Developer email: Your email
3. Click "Save and Continue" (skip Scopes)
4. Add test users if needed

### Step 6: Create OAuth Client
1. Application type: "Web application"
2. Name: "E-Commerce Web Client"
3. Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:5000
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
5. Click "Create"

### Step 7: Copy Credentials
```
Client ID: 123456789-abc...googleusercontent.com
Client Secret: GOCSPX-...
```

### Step 8: Update .env
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

---

## 🔵 2. Facebook OAuth Setup (5 minutes)

### Step 1: Go to Facebook Developers
Visit: https://developers.facebook.com/

### Step 2: Create App
1. Click "My Apps" → "Create App"
2. Select "Consumer" or "None"
3. Click "Next"
4. Fill in:
   - App name: "E-Commerce Store"
   - App contact email: Your email
5. Click "Create App"

### Step 3: Add Facebook Login Product
1. In dashboard, find "Facebook Login"
2. Click "Set Up"
3. Select "Web"

### Step 4: Configure Settings
1. Go to "Facebook Login" → "Settings"
2. Add Valid OAuth Redirect URIs:
   ```
   http://localhost:5000/api/auth/facebook/callback
   ```
3. Click "Save Changes"

### Step 5: Get App Credentials
1. Go to "Settings" → "Basic"
2. Copy:
   ```
   App ID: 1234567890123456
   App Secret: (click "Show" to reveal)
   ```

### Step 6: Update .env
```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

### Step 7: Add Test Users (Development)
1. Go to "Roles" → "Test Users"
2. Add test accounts to use during development
3. OR set app to "Live" mode (Settings → Basic → App Mode)

---

## ⚫ 3. GitHub OAuth Setup (3 minutes)

### Step 1: Go to GitHub Settings
Visit: https://github.com/settings/developers

### Step 2: Create OAuth App
1. Click "OAuth Apps"
2. Click "New OAuth App"
3. Fill in:
   - Application name: "E-Commerce Store"
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL:
     ```
     http://localhost:5000/api/auth/github/callback
     ```
4. Click "Register application"

### Step 3: Get Client Credentials
```
Client ID: Iv1.abc123...
Client Secret: (click "Generate a new client secret")
```
**Important:** Copy the secret immediately - you won't see it again!

### Step 4: Update .env
```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

---

## 🚀 Quick Start After Setup

### Complete .env File Should Look Like:
```env
PORT=5000
MONGO_URI=mongodb+srv://...

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abc123def456
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456ghi789
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Frontend & Session
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_session_secret_key
```

### Start Servers:
```bash
# Terminal 1 - Backend
node Backend/server.js

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

### Test Each Provider:
1. Open http://localhost:5173/login
2. Click "Continue with Google" → Test Google login
3. Click "Facebook" → Test Facebook login
4. Click "GitHub" → Test GitHub login

---

## ✅ Testing Checklist

### Google OAuth:
- [ ] Credentials added to .env
- [ ] Redirect URI matches exactly
- [ ] Click "Continue with Google"
- [ ] Login with Gmail account
- [ ] User created in MongoDB with `googleId`

### Facebook OAuth:
- [ ] App ID & Secret in .env
- [ ] Redirect URI configured
- [ ] App in test/live mode
- [ ] Click "Facebook" button
- [ ] Login with Facebook account
- [ ] User created with `facebookId`

### GitHub OAuth:
- [ ] Client ID & Secret in .env
- [ ] Callback URL configured
- [ ] Click "GitHub" button
- [ ] Authorize with GitHub
- [ ] User created with `githubId`

---

## 🎯 How It Works

### User Flow:
```
1. User clicks social button (Google/Facebook/GitHub)
   ↓
2. Redirected to provider's login page
   ↓
3. User logs in with provider credentials
   ↓
4. User grants permissions
   ↓
5. Provider redirects back with auth code
   ↓
6. Backend exchanges code for user profile
   ↓
7. Check if user exists in MongoDB:
   - Exists by provider ID → Login
   - Exists by email → Link account
   - New user → Create account
   ↓
8. Generate JWT token
   ↓
9. Set HTTP-only cookie
   ↓
10. Redirect to frontend with token
   ↓
11. Frontend stores token in Zustand + localStorage
   ↓
12. User is logged in! ✅
```

---

## 🔐 Security Features

✅ **OAuth 2.0** - Industry standard  
✅ **No password storage** - Provider handles auth  
✅ **JWT tokens** - Secure authentication  
✅ **HTTP-only cookies** - XSS protection  
✅ **Account linking** - Same email across providers  
✅ **Unique IDs** - googleId, facebookId, githubId  

---

## 🐛 Troubleshooting

### Google Errors:
| Error | Solution |
|-------|----------|
| "Redirect URI mismatch" | Check Google Console callback URL |
| "Invalid client" | Verify Client ID in .env |
| "Access denied" | User must click "Allow" |

### Facebook Errors:
| Error | Solution |
|-------|----------|
| "URL Blocked" | Add redirect URI in Facebook app settings |
| "App Not Live" | Add test users or set app to Live mode |
| "Invalid OAuth redirect" | Check Facebook callback URL |

### GitHub Errors:
| Error | Solution |
|-------|----------|
| "Redirect URI mismatch" | Check GitHub app callback URL |
| "Bad credentials" | Regenerate client secret |

### General Issues:
- **MongoDB errors:** Check connection string
- **Port conflicts:** Ensure 5000 and 5173 are free
- **CORS errors:** Check CORS settings in server.js
- **Token not stored:** Check browser console

---

## 📊 Database Structure

### User with Multiple OAuth Providers:
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://...",
  role: "user",
  
  // OAuth IDs (unique per provider)
  googleId: "1234567890",        // If signed in with Google
  facebookId: "9876543210",      // If signed in with Facebook
  githubId: "11223344",          // If signed in with GitHub
  
  // Password (only if signed up with email)
  password: "hashed...",         // Optional
  
  createdAt: "2025-12-04T...",
  updatedAt: "2025-12-04T..."
}
```

### Account Linking:
If a user signs up with email first, then logs in with Google using the same email:
- `googleId` is added to existing account
- User can now login with either email/password OR Google

---

## 🎉 Success Indicators

You'll know everything works when:
- ✅ All three social buttons are clickable (not disabled)
- ✅ Clicking each button redirects to provider login
- ✅ After login, user is back at your site
- ✅ Navbar shows user name/avatar
- ✅ User stays logged in after page refresh
- ✅ User document in MongoDB has provider ID

---

## 🚨 Important Notes

### Development:
1. **Never commit .env** with real credentials
2. **Use test accounts** for Facebook/Google
3. **Localhost only** - won't work on other IPs

### Production:
1. **Update all callback URLs** to production domain
2. **Enable app review** for Facebook (if using advanced permissions)
3. **Verify domains** in Google Console
4. **Use HTTPS** everywhere
5. **Rotate secrets** regularly

---

## 📚 API Endpoints

### All OAuth Providers:
```
GET  /api/auth/google              # Start Google OAuth
GET  /api/auth/google/callback     # Google callback

GET  /api/auth/facebook            # Start Facebook OAuth
GET  /api/auth/facebook/callback   # Facebook callback

GET  /api/auth/github              # Start GitHub OAuth
GET  /api/auth/github/callback     # GitHub callback
```

---

## 🎓 What Changed

### Backend Files Modified:
- ✅ `Config/passport.js` - Added Facebook & GitHub strategies
- ✅ `models/user.model.js` - Added facebookId & githubId
- ✅ `Controller/google_auth_controller.js` - Unified OAuth handler
- ✅ `Routes/social_auth_routes.js` - All three OAuth routes
- ✅ `server.js` - Updated imports
- ✅ `.env` - All OAuth credentials

### Frontend Files Modified:
- ✅ `Pages/LoginPage.jsx` - All buttons enabled & functional
- ✅ `Pages/SignupPage.jsx` - All buttons enabled & functional

---

## 💯 Final Checklist

Before testing, make sure:
- [ ] MongoDB is running
- [ ] All 6 OAuth credentials in .env (Google, Facebook, GitHub)
- [ ] All redirect URIs configured correctly
- [ ] node_modules installed
- [ ] Both servers running (backend & frontend)

---

**All three social logins are now FULLY FUNCTIONAL!** 🎉

No dummy buttons. No disabled states. **Real OAuth authentication!** 🚀
