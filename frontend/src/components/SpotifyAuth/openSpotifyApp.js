export default function tryOpenSpotifyApp() {
  return new Promise((resolve) => {
    const spotifyAuthUrl = "spotify://login";

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

    window.location.href = spotifyAuthUrl;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resolve(false);
    }, 1000);
  });
}
