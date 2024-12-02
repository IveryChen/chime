import API_URL from "../../constants/apiUrl";

export default async function handleSubmitSelection(props) {
  const { roomCode, playerId, selectedPlaylists } = props;

  try {
    const response = await fetch(
      `${API_URL}/game/select-playlists/${roomCode}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId,
          playlist_ids: selectedPlaylists,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to submit playlist selection:", error);
    throw error;
  }
}
