export default function tryOpenSpotifyApp() {
  return new Promise((resolve) => {
    // Just try to open the Spotify app first
    const spotifyAppUrl = "spotify:";

    const wasHidden = document.hidden;

    const handleVisibilityChange = () => {
      if (document.hidden !== wasHidden) {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        resolve(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.location.href = spotifyAppUrl;

    // Fallback after 1 second if app doesn't open
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resolve(false);
    }, 1000);
  });
}
