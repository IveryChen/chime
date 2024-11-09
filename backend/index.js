const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const SpotifyWebApi = require("spotify-web-api-node");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Chime Backend API" });
});

// Spotify auth endpoint
app.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "playlist-read-private",
    "user-top-read",
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.json({ url: authorizeURL });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
