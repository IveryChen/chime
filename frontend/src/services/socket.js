import { io } from "socket.io-client";
import state from "../state";

const SOCKET_URL = import.meta.env.PROD
  ? "wss://chime-6r3r.onrender.com"
  : "ws://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      path: "/sockets",
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
      reconnectionDelay: 1000,
      forceNew: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.isConnected = true;

      this.eventHandlers.forEach((handler, event) => {
        this.socket.on(event, handler);
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.onAny((eventName, ...args) => {
      console.log(`Socket received event: ${eventName}`, args);
    });

    this.socket.on("players-update", ({ players }) => {
      state.select("game", "players").set(players);
    });
  }

  on(event, handler) {
    console.log(`Registering handler for ${event}`, handler);
    this.eventHandlers.set(event, handler);

    if (this.isConnected && this.socket) {
      console.log(`Socket is connected, attaching handler for ${event}`);
      this.socket.on(event, (...args) => {
        console.log(`Event ${event} received with args:`, args);
        handler(...args);
      });
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
    if (!this.socket) return;
    this.socket.emit("join-room", { roomCode, player });
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
