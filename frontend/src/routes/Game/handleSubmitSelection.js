import API_URL from "../../constants/apiUrl";

export default async function handleSubmitSelection(props) {
  const { playerId, roomCode, selectedPlaylists } = props;

  try {
    const response = await fetch(
      `${API_URL}/game/select-playlists/${roomCode}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId,
          selected_playlists: selectedPlaylists,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: data.status,
    };
  } catch (error) {
    console.error("Failed to submit playlist selection:", error);
    throw error;
  }
}
