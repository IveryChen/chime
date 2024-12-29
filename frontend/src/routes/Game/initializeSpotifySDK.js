export default function initializeSpotifySDK(
  onChangeDeviceId,
  onChangeSpotifyPlayer
) {
  return new Promise((resolve, reject) => {
    // First, set up the callback BEFORE loading the script
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Cassette Game",
        getOAuthToken: (cb) => {
          const token = localStorage.getItem("spotify_access_token");
          cb(token);
        },
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize:", message);
        reject(new Error(message));
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Failed to authenticate:", message);
        reject(new Error(message));
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Spotify Player Ready with Device ID:", device_id);
        onChangeDeviceId(device_id);
        onChangeSpotifyPlayer(player);
        resolve({ player, deviceId: device_id });
      });

      player.connect().then((success) => {
        if (success) {
          console.log("Successfully connected to Spotify");
        }
      });
    };

    // Then, load the script if it's not already loaded
    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      script.onerror = (error) => {
        console.error("Failed to load Spotify SDK:", error);
        reject(error);
      };

      document.body.appendChild(script);
    }
  });
}
