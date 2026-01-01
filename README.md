# 🛒 E-Commerce Project - Complete Authentication System


A modern, full-stack e-commerce application with **Google OAuth authentication**, real-time password validation, and a beautiful UI.

---

## Overview

This repository contains the **authentication and identity layer** of a modern full‑stack **E‑Commerce application**. The implementation follows **industry‑standard security practices**, clean architecture, and production‑ready patterns.

The system supports **traditional email/password authentication** as well as **Google OAuth 2.0**, integrated with JWT‑based session handling and secure cookie storage. The frontend provides a polished, accessible UI with real‑time validation and a modern user experience.

---

## Key Capabilities

### Authentication & Identity

* Email & password registration/login
* Google OAuth 2.0 (fully functional)
* JWT‑based authentication with expiration
* HTTP‑only secure cookies
* Password reset workflow (token‑based)
* Session persistence on client side
* Role‑based access support (user/admin)

### Security

* bcrypt password hashing
* JWT expiration & rotation ready
* Protected API routes
* Input validation & sanitization
* CORS configuration
* MongoDB injection prevention
* No secrets committed to repository

### User Experience

* Responsive, mobile‑friendly UI
* Chakra UI design system
* Real‑time password strength indicator
* Clear authentication feedback
* Accessible form components

---
## Technology Stack

<div align="center">
  
**Frontend**
  
<img src="https://skillicons.dev/icons?i=react" />

**Backend**

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,mysql" />

**Tools**

<img src="https://skillicons.dev/icons?i=linux,git,github,vscode,postman,figma" />

</div>



### Remaining Frontend Technologies

* Chakra UI
* Zustand (state management)
* React Router
* Framer Motion

### Backend

* Mongoose
* Passport.js
* JWT
* bcrypt

---

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
Backend/.env
```

**Edit `Backend/.env`** with your own credentials:

```env

MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/ecommerce?appName=...
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT= your_own
```

**Note:** (May or Maynot ) your `MONGO_URI` includes the database name (e.g., `/ecommerce`) after `.mongodb.net/`

---

### Terminal 1: Start Backend Server

**From the Backend directory:**

```bash
node server.js
```

### Terminal 2: Start Frontend Server

**From the Frontend directory:**

```bash
cd Frontend
npm run dev
```

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


## Developer

**Muhammad Saad Qasim**
GitHub: [https://github.com/SaadQasim19](https://github.com/SaadQasim19)

---

If you find this useful, consider starring the repository ⭐

---