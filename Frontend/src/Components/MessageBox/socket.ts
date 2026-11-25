import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Adjust if backend runs elsewhere

let socket: Socket | null = null;

export const initiateSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_URL);
    socket.on("connect", () => {
      socket?.emit("register", userId);
    });
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
