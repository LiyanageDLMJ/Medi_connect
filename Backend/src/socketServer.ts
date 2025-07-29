import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Message from './models/MessageModel';

// Mapping users to their socket IDs for private messaging
const userSocketMap: { [userId: string]: string } = {};

// Store io instance for use in other modules
let io: Server;

// Attach Socket.IO to an existing HTTP server (created in index.ts)
export const attachSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user with their userId
    socket.on("register", (userId: string) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Join notification room for real-time notifications
    socket.on("join_notification_room", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined notification room`);
    });

    // Leave notification room
    socket.on("leave_notification_room", (userId: string) => {
      socket.leave(userId);
      console.log(`User ${userId} left notification room`);
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      const { to, from, message, fileUrl, fileType, userType } = data;
      const targetSocketId = userSocketMap[to];
      try {
        // Persist message and get the saved message with _id
        const savedMsg = await Message.create({ senderId: from, receiverId: to, content: message, fileUrl, fileType });
        // Emit to receiver only
        if (targetSocketId) {
          io.to(targetSocketId).emit("receive_message", { _id: savedMsg._id, from, to, message, fileUrl, fileType, userType, createdAt: savedMsg.createdAt });
        }
      } catch (err) {
        console.error('Socket message save error', err);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

// Export io instance for use in notification controller
export { io };
