export default function initializeSpotifySDK(
  onChangeDeviceId,
  onChangeSpotifyPlayer
) {
  return new Promise((resolve) => {
    // First, set up the callback BEFORE loading the script
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Cassette Game",
        getOAuthToken: (cb) => {
          const token = localStorage.getItem("spotify_access_token");
          cb(token);
        },
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Spotify Player Ready with Device ID:", device_id);
        onChangeDeviceId(device_id);
        onChangeSpotifyPlayer(player);
        resolve({ player, deviceId: device_id });

        // Set as active device immediately
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "spotify_access_token"
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });
      });
      player.connect();
    };

    // Then, load the script if it's not already loaded
    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}
