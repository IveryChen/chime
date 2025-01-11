export default async function playSnippet(
  deviceId,
  spotifyPlayer,
  uri,
  previewType
) {
  if (previewType === "deezer" || previewType === "spotify_preview") {
    return new Promise((resolve) => {
      const audio = new Audio(uri);

      // Start 30 seconds in if possible
      audio.currentTime = 30;

      audio
        .play()
        .then(() => {
          // Stop after 2 seconds
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            resolve();
          }, 2000);
        })
        .catch((error) => {
          console.error("Audio playback error:", error);
          resolve();
        });
    });
  }

  if (!spotifyPlayer || !deviceId) {
    console.error("Spotify player not ready");
    return;
  }

  try {
    await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });

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

    // Return a promise that resolves after 2 seconds
    return new Promise((resolve) => {
      setTimeout(async () => {
        await spotifyPlayer.pause();
        resolve();
      }, 2000);
    });
  } catch (error) {
    console.error("Playback error:", error);
  }
}
