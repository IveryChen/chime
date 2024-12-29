export default async function playSnippet(deviceId, spotifyPlayer, uri) {
  if (!spotifyPlayer || !deviceId) {
    console.error("Spotify player not ready");
    return;
  }

  try {
    // Return a promise that resolves after both play and pause are complete
    return new Promise(async (resolve) => {
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
      setTimeout(async () => {
        await fetch(
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
        resolve(); // Resolve after pause completes
      }, 2000);
    });
  } catch (error) {
    console.error("Playback error:", error);
  }
}
