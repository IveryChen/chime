import API_URL from "../../constants/apiUrl";

export default async function handleJoinGame(playerName, roomCode) {
  try {
    const response = await fetch(`${API_URL}/game/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomCode: roomCode,
        playerName: playerName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Server response:", data); // Debug log
      if (Array.isArray(data)) {
        // If it's validation errors array
        throw new Error(data.map((err) => err.msg).join(", "));
      }
      throw new Error(data.detail || "Failed to join game");
    }

    if (!data.room_code || !data.players) {
      console.log("Unexpected response format:", data); // Debug log
      throw new Error("Invalid response format from server");
    }

    return {
      roomCode: data.room_code,
      host: data.host,
      players: data.players,
      status: data.status,
    };
  } catch (error) {
    console.error("Error joining game room:", error);
    throw error;
  }
}
