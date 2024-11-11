import { API_URL } from "./api";

export default async function handleCreateGame(playerName, spotifyToken) {
  try {
    const response = await fetch(`${API_URL}/game/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostName: playerName,
        spotifyToken: spotifyToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to create game room");
    }

    return {
      roomCode: data.room_code,
      host: data.host,
      players: data.players,
      status: data.status,
    };
  } catch (error) {
    console.error("Error creating game room:", error);
    throw error;
  }
}
