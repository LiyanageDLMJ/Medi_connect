import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

// Initialize socket immediately but with connection disabled temporarily
const socket: Socket = io(SOCKET_URL, {
  autoConnect: true // Re-enable auto-connect
});

socket.on("connect", () => {
  console.log('Socket connected');
});

socket.on("disconnect", () => {
  console.log('Socket disconnected');
});

socket.on("connect_error", (error) => {
  console.error('Socket connection error:', error);
});

export const initiateSocket = (userId: string) => {
  // Re-enable socket connection
  socket.emit("register", userId);
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket.disconnect();
};

export { socket }; 