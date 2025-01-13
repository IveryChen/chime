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
