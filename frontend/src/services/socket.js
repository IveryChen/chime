import { io } from "socket.io-client";
import state from "../state";

const SOCKET_URL = import.meta.env.PROD
  ? "https://chime-6r3r.onrender.com"
  : "ws://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
    this.pendingRoomJoin = null;
  }

  connect() {
    console.log("Attempting to connect to:", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      path: "/sockets",
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
      reconnectionDelay: 1000,
      forceNew: true,
      // Add timeout config
      timeout: 20000,
      // Enable debug logs
      debug: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.isConnected = true;

      if (this.pendingRoomJoin) {
        const { roomCode, player } = this.pendingRoomJoin;
        this.joinRoom(roomCode, player);
        this.pendingRoomJoin = null;
      }

      this.eventHandlers.forEach((handler, event) => {
        this.socket.on(event, handler);
      });
    });

    this.socket.io.on("error", (error) => {
      console.error("Transport Error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("players-update", ({ players, status }) => {
      state.select("games", "currentRoom", "players").set(players);
      if (status) {
        state.select("games", "currentRoom", "status").set(status);
      }
    });

    this.socket.on("room-status-update", ({ status }) => {
      state.select("games", "currentRoom", "status").set(status);
    });
  }

  on(event, handler) {
    this.eventHandlers.set(event, handler);

    if (this.isConnected && this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event, handler) {
    this.eventHandlers.delete(event);

    if (this.isConnected && this.socket) {
      this.socket.off(event, handler);
    }
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  joinRoom(roomCode, player) {
    if (!this.socket || !this.isConnected) {
      this.pendingRoomJoin = { roomCode, player };
      return;
    }

    this.socket.emit("join-room", { roomCode, player });
  }

  updateRoomStatus(roomCode, status) {
    if (!this.socket) return;
    this.socket.emit("update_room_status", { roomCode, status });
  }

  leaveRoom(roomCode) {
    if (!this.socket) return;
    this.socket.emit("leave-room", { roomCode });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.eventHandlers.clear();
  }
}

const socketService = new SocketService();
export default socketService;
