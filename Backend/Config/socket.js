import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

/**
 * Initialize Socket.IO server with authentication
 * @param {import('http').Server} httpServer - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      // Allow anonymous connections for public events
      socket.userId = null;
      socket.isAdmin = false;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.isAdmin = decoded.isAdmin || false;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`✓ Socket connected: ${socket.id} | User: ${socket.userId || 'anonymous'}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      console.log(`  → Joined room: user:${socket.userId}`);
    }

    // Join admin room
    if (socket.isAdmin) {
      socket.join("admin");
      console.log(`  → Joined admin room`);
    }

    // Handle custom events
    socket.on("disconnect", () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error: ${socket.id}`, error);
    });
  });

  console.log("✓ Socket.IO initialized");
  return io;
};

/**
 * Get the Socket.IO server instance
 * @returns {Server} Socket.IO server instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initializeSocket first.");
  }
  return io;
};

/**
 * Emit event to specific user
 * @param {string} userId - User ID to send event to
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit event to all admins
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToAdmins = (event, data) => {
  if (!io) return;
  io.to("admin").emit(event, data);
};

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToAll = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};
