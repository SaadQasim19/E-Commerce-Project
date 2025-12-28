# 🚀 Quick Setup Guide

## For New Developers Cloning This Repository

Follow these steps to get the E-Commerce project running on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB Atlas account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- ✅ **Git** installed
- ✅ **VS Code** (recommended) or any code editor

---

## 🔧 Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/SaadQasim19/E-Commerce-Project.git
cd E-Commerce-Project
```

### Step 2: Install Backend Dependencies

**Run this from the ROOT directory** (E-Commerce-Project/):

```bash
npm install
```

This installs all backend dependencies (Express, MongoDB, JWT, etc.) listed in the root `package.json`.

### Step 3: Install Frontend Dependencies

**Navigate to the Frontend folder** and install:

```bash
cd Frontend
npm install
```

This installs all frontend dependencies (React, Vite, Chakra UI, etc.).

### Step 4: Set Up Environment Variables

Go back to the root directory and set up your `.env` file:

```bash
cd ..
cp Backend/.env.example Backend/.env
```

**Edit `Backend/.env`** with your own credentials:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/ecommerce?appName=...

# JWT Secret (use any random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret (use any random string)
SESSION_SECRET=your_session_secret_here

# Google OAuth (optional - only if using Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Port
PORT=5000
```

**Important:** Make sure your `MONGO_URI` includes the database name (e.g., `/ecommerce`) after `.mongodb.net/`

---

## ▶️ Running the Application

You need **TWO terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend Server

**From the ROOT directory:**

```bash
npm run dev
```

✅ Backend should start on: **http://localhost:5000**

You should see:
```
🚀 Server is running on port 5000
📦 MongoDB Connected
```

### Terminal 2: Start Frontend Server

**From the Frontend directory:**

```bash
cd Frontend
npm run dev
```

✅ Frontend should start on: **http://localhost:5173**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

Open your browser and go to:

👉 **http://localhost:5173**

You should see the E-Commerce homepage with products!

---

## 📁 Project Structure Quick Reference

```
E-Commerce-Project/
│
├── package.json              ← Backend dependencies (npm install from HERE)
├── Backend/
│   ├── .env                  ← Your environment variables
│   ├── server.js             ← Backend entry point
│   ├── Config/
│   ├── Controller/
│   ├── models/
│   └── Routes/
│
└── Frontend/
    ├── package.json          ← Frontend dependencies (npm install from HERE)
    ├── src/
    │   ├── Components/
    │   ├── Pages/
    │   └── Store/            ← Zustand state management
    └── vite.config.js
```

---

## 🆘 Troubleshooting

### Backend Issues

**Problem:** `Cannot connect to MongoDB`
- ✅ Check your `MONGO_URI` in `Backend/.env`
- ✅ Make sure your MongoDB Atlas IP whitelist includes your current IP (or use `0.0.0.0/0` for all IPs)
- ✅ Verify database name is included in URI: `.mongodb.net/ecommerce?appName=...`

**Problem:** `Port 5000 is already in use`
- ✅ Change `PORT=5000` to `PORT=5001` in `Backend/.env`
- ✅ Update frontend API URLs if needed

### Frontend Issues

**Problem:** `Cannot connect to backend API`
- ✅ Make sure backend is running on port 5000
- ✅ Check `Frontend/src/config/api.js` for correct API URL

**Problem:** `Module not found errors`
- ✅ Delete `node_modules` and `package-lock.json` in Frontend/
- ✅ Run `npm install` again in Frontend/

**Problem:** Cart/Wishlist not persisting
- ✅ Clear browser localStorage
- ✅ Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🎯 Quick Test Checklist

After setup, verify everything works:

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Products display on homepage
- [ ] Can create an account (Sign Up)
- [ ] Can log in with created account
- [ ] Can add products to cart
- [ ] Can add products to wishlist
- [ ] Cart/wishlist persists after page refresh

---

## 📚 Additional Documentation

- **Main README**: [README.md](README.md)
- **Google OAuth Setup**: [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
- **Data Storage Info**: [Notes/Data_Storage.txt](Notes/Data_Storage.txt)
- **Bug Fixes**: Check `Notes/` folder for various fix documentation

---

## 🤝 Need Help?

If you're still having issues:

1. Check the `Notes/` folder for specific bug fix documentation
2. Verify all environment variables are set correctly
3. Make sure both servers are running simultaneously
4. Check browser console for frontend errors
5. Check terminal for backend errors

---

## 📝 Summary: Where to Run npm install?

| Command | Location | Purpose |
|---------|----------|---------|
| `npm install` | **Root directory** (E-Commerce-Project/) | Install backend dependencies |
| `npm install` | **Frontend/** directory | Install frontend dependencies |
| `npm run dev` | **Root directory** | Run backend server |
| `npm run dev` | **Frontend/** directory | Run frontend server |

**Remember:** You need to install dependencies in BOTH locations!

---

Happy Coding! 🎉
