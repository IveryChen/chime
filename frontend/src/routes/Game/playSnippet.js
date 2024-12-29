export default async function playSnippet(deviceId, spotifyPlayer, uri) {
  console.log("calling playSnippet", deviceId, spotifyPlayer);

  if (!spotifyPlayer || !deviceId) {
    console.error("Spotify player not ready");
    return;
  }

  try {
    // Start playing
    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "spotify_access_token"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [uri],
          position_ms: 30000, // Start 30 seconds in
        }),
      }
    );

    // Stop after 2 second
    setTimeout(() => {
      fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "spotify_access_token"
            )}`,
          },
        }
      );
    }, 2000);
  } catch (error) {
    console.error("Playback error:", error);
  }
}
