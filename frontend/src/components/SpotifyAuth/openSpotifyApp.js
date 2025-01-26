export default function tryOpenSpotifyApp() {
  return new Promise((resolve) => {
    const spotifyAppUrl =
      `spotify:authorize:` +
      `?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(
        import.meta.env.VITE_SPOTIFY_REDIRECT_URI
      )}` +
      `&scope=${encodeURIComponent(
        [
          "playlist-read-private",
          "playlist-read-collaborative",
          // add any other scopes you need
        ].join(" ")
      )}`;

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
