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

### Frontend

* React (Vite)
* Chakra UI
* Zustand (state management)
* React Router
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Passport.js
* JWT
* bcrypt

---

## Getting Started

### Prerequisites

* Node.js (v14+)
* MongoDB Atlas account
* Google Cloud Console account (OAuth)

---

### Installation

```bash
# Clone repository
cd E-Commerce-Project

# Install backend dependencies (in root directory)
npm install

# Install frontend dependencies
cd Frontend
npm install
cd ..
```

---

### Environment Configuration

All sensitive values are stored in environment variables.

```bash
cd Backend
```

Edit `.env` and provide your own credentials:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```


---


### Running the Application

#### Backend

```bash
node Backend/server.js
```

#### Frontend

```bash
cd Frontend
npm run dev
```

Access:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000](http://localhost:5000)

---

## Project Structure

```
E-Commerce-Project/
├── Backend/
│   ├── Config/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── .env.example
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Store/
│   │   └── App.jsx
│   └── main.jsx
│
├── GOOGLE_OAUTH_SETUP.md
├── DESIGN_IMPROVEMENTS.md
└── README.md
```

---


## Security Notes

* Passwords are **never stored in plain text**
* OAuth users do not require passwords
* Cookies are HTTP‑only
* JWTs expire automatically
* Role checks enforced on protected routes

---

## Contribution Policy

This project is primarily educational and portfolio‑focused.

* Issues and suggestions are welcome
* Pull requests should follow clean code practices
* No credentials or secrets in commits

---

## License

This project is intended for **educational and learning purposes**.

---

## Author

**Saad Qasim**
GitHub: [https://github.com/SaadQasim19](https://github.com/SaadQasim19)

---

## Final Notes

This repository intentionally focuses on **security, clarity, and professionalism**. It is designed to demonstrate real‑world authentication practices rather than experimental code.

If you find this useful, consider starring the repository ⭐

---

**Happy coding. Securely.** 🔐🚀
