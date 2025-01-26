export default function tryOpenSpotifyApp() {
  return new Promise((resolve) => {
    const spotifyAppUrl = `spotify://authenticate?client_id=${
      import.meta.env.VITE_SPOTIFY_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      import.meta.env.VITE_SPOTIFY_REDIRECT_URI
    )}`;

    // Store current visibility state
    const wasHidden = document.hidden;

    // Listen for visibility change (app opened)
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

    // Try to open the app
    window.location.href = spotifyAppUrl;

    // Fallback after 1 second if app doesn't open
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resolve(false);
    }, 1000);
  });
}
