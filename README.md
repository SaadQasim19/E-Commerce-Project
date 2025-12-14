# 🛒 E-Commerce Project - Complete Authentication System

> For the complete system documentation (modules, tech stack, usage, troubleshooting), see **[OFFICIAL_PROJECT_DOCUMENTATION.md](OFFICIAL_PROJECT_DOCUMENTATION.md)**

A modern, full-stack e-commerce application with **Google OAuth authentication**, real-time password validation, and a beautiful UI.

## ✨ Features

### 🔐 Authentication
- ✅ **Email/Password Registration & Login**
- ✅ **Google OAuth 2.0 Integration** (Functional!)
- ✅ **JWT Token-based Authentication**
- ✅ **Secure Password Hashing** (bcrypt)
- ✅ **HTTP-only Cookies**
- ✅ **Password Reset Flow**
- ✅ **Real-time Password Strength Meter**
- ✅ **Persistent Sessions** (Zustand + LocalStorage)

### 🎨 Modern UI
- ✅ Clean, responsive design
- ✅ Chakra UI components
- ✅ Smooth animations (Framer Motion)
- ✅ Dark mode support
- ✅ Mobile-friendly layout

### 🔒 Security
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ Input validation
- ✅ Protected API routes

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas)
- Google Cloud Console account (for OAuth)

### 1. Clone & Install

```bash
cd /home/saad/Desktop/DBProject/E-Commerce-Project
npm install
cd Frontend && npm install && cd ..
```

### 2. Set Up Google OAuth

Follow the detailed guide: **[GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)**

Quick steps:
1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret

### 3. Configure Environment

```bash
cd Backend
cp .env.example .env
nano .env  # or use any text editor
```

Fill in your credentials:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### 4. Start the Application

#### Option A: Use the start script (easiest)
```bash
./start.sh
```

#### Option B: Manual start

**Terminal 1 - Backend:**
```bash
node Backend/server.js
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### 5. Open in Browser

Frontend: http://localhost:5173
Backend API: http://localhost:5000

---

## 📁 Project Structure

```
E-Commerce-Project/
├── Backend/
│   ├── Config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── passport.js              # Google OAuth config ✨
│   ├── Controller/
│   │   ├── auth_controller.js       # Email/password auth
│   │   └── google_auth_controller.js # Google OAuth ✨
│   ├── middleware/
│   │   └── auth.middleware.js       # JWT verification
│   ├── models/
│   │   └── user.model.js            # User schema (with googleId) ✨
│   ├── Routes/
│   │   ├── auth_routes.js           # Auth endpoints
│   │   └── google_auth_routes.js    # Google OAuth routes ✨
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Template
│   └── server.js                    # Express server
│
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Navbar.jsx          # Navigation with auth
│   │   │   └── Footer.jsx
│   │   ├── Pages/
│   │   │   ├── LoginPage.jsx       # Login with Google ✨
│   │   │   ├── SignupPage.jsx      # Signup with Google ✨
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── AuthCallbackPage.jsx # OAuth callback handler ✨
│   │   │   └── HomePage.jsx
│   │   ├── Store/
│   │   │   └── auth.js             # Zustand auth store ✨
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── GOOGLE_OAUTH_SETUP.md          # 📖 Setup guide
├── DESIGN_IMPROVEMENTS.md         # 🎨 Design documentation
├── start.sh                       # 🚀 Quick start script
└── README.md                      # 📄 This file
```

---

## 🎯 API Endpoints

### Authentication (Email/Password)
```
POST   /api/auth/signup              # Register new user
POST   /api/auth/login               # Login user
POST   /api/auth/logout              # Logout user
GET    /api/auth/me                  # Get current user
PUT    /api/auth/update-profile      # Update profile
PUT    /api/auth/update-password     # Change password
POST   /api/auth/forgot-password     # Request password reset
PUT    /api/auth/reset-password/:token # Reset password
```

### Google OAuth ✨
```
GET    /api/auth/google              # Initiate Google OAuth
GET    /api/auth/google/callback     # OAuth callback
GET    /api/auth/google/current      # Get Google user
```

### Products
```
GET    /api/products                 # Get all products
POST   /api/products                 # Create product (admin)
GET    /api/products/:id             # Get product by ID
PUT    /api/products/:id             # Update product (admin)
DELETE /api/products/:id             # Delete product (admin)
```

---

## 🔑 User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed, optional for Google users),
  googleId: String (unique, optional), // ✨ New!
  avatar: String,
  phone: String,
  role: "user" | "admin",
  addresses: Array,
  isEmailVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design Highlights

### Before vs After: Social Login Buttons

**❌ Before:**
```
[Google] [Facebook] [GitHub]  ← Cramped!
```

**✅ After:**
```
[🔴 Continue with Google    ]  ← Full width, functional!

[Facebook]     [GitHub]        ← Disabled (coming soon)
```

### Key Improvements:
1. **Google OAuth is now functional** - Real authentication flow
2. **Better mobile UX** - Full-width button, easy to tap
3. **Clear hierarchy** - Google is primary, others disabled
4. **Honest design** - Shows what's available vs coming soon
5. **Modern layout** - Vertical stack instead of cramped horizontal

See [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md) for detailed comparison.

---

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Real-time Validation
- ✅ Password strength meter (Weak/Fair/Good/Strong)
- ✅ Visual checkmarks for each requirement
- ✅ Color-coded progress bar
- ✅ Password match validation

### Backend Security
- bcrypt password hashing (10 rounds)
- JWT tokens with 30-day expiration
- HTTP-only cookies
- CORS protection
- MongoDB injection prevention

---

## 🧪 Testing Google OAuth

1. **Start both servers**
2. **Navigate to** http://localhost:5173/login
3. **Click** "Continue with Google"
4. **Select** your Google account
5. **Grant** permissions
6. **Success!** You should be redirected and logged in

### Troubleshooting
- ❌ "Redirect URI mismatch" → Check Google Console callback URL
- ❌ "Invalid client" → Verify Client ID in .env
- ❌ User not created → Check MongoDB connection
- ❌ Token not stored → Check browser console

See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for detailed troubleshooting.

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI framework
- **Vite 6.3.5** - Build tool
- **Chakra UI 2.10.8** - Component library
- **Zustand 5.0.5** - State management
- **Framer Motion 12.23.24** - Animations
- **React Router DOM** - Routing
- **React Icons** - Icon library

### Backend
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Passport.js** - Authentication middleware
- **passport-google-oauth20** - Google OAuth strategy
- **jsonwebtoken** - JWT tokens
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **express-session** - Session management
- **dotenv** - Environment variables
- **cors** - CORS middleware

---

## 📚 Documentation

- **[GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)** - Complete Google OAuth setup guide
- **[DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md)** - UI/UX improvements documentation
- **[Backend/.env.example](Backend/.env.example)** - Environment variables template

---

## 🚧 Future Enhancements

### Phase 1: Authentication (Completed ✅)
- [x] Email/Password auth
- [x] Google OAuth
- [x] Password reset flow
- [x] JWT tokens
- [x] Protected routes

### Phase 2: Additional OAuth (Coming Soon)
- [ ] Facebook OAuth
- [ ] GitHub OAuth
- [ ] Apple Sign In
- [ ] Microsoft Account

### Phase 3: Advanced Features
- [ ] Two-Factor Authentication (2FA)
- [ ] Email verification
- [ ] Account linking
- [ ] Social profile sync
- [ ] OAuth token refresh

### Phase 4: E-Commerce Features
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order management
- [ ] Product reviews
- [ ] Admin dashboard

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Saad Qasim**
- GitHub: [@SaadQasim19](https://github.com/SaadQasim19)

---

## 🎉 Acknowledgments

- Chakra UI for the beautiful components
- Passport.js for OAuth made easy
- MongoDB Atlas for free database hosting
- Google Cloud Platform for OAuth services

---

## 📞 Need Help?

1. Check the console for errors (backend terminal & browser)
2. Read [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
3. Verify your .env file
4. Check MongoDB connection
5. Ensure both servers are running

**Happy coding! 🚀**
