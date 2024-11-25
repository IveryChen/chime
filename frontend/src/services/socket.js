import { io } from "socket.io-client";
import state from "../state";

const SOCKET_URL = import.meta.env.PROD
  ? "wss://chime-6r3r.onrender.com"
  : "ws://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
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
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    this.socket.on("players-update", ({ players }) => {
      state.select("game", "players").set(players);
    });
  }

  joinRoom(roomCode, player) {
    this.socket.emit("join-room", { roomCode, player });
  }

  leaveRoom(roomCode) {
    this.socket.emit("leave-room", { roomCode });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();
export default socketService;
