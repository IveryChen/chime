import API_URL from "../../constants/apiUrl";

export default async function handleJoinGame(playerName, roomCode) {
  try {
    const response = await fetch(`${API_URL}/game/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_code: roomCode,
        player_name: playerName,
        spotify_token: null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to join game");
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
