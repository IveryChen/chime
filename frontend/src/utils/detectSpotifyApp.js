import getPlatform from "./getPlatform";

export default async function detectSpotifyApp() {
  if (getPlatform() === "Desktop") return false;

  // Try to detect if Spotify app is installed
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 1000);

    const spotifyScheme = "spotify://";
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = spotifyScheme;

    iframe.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    iframe.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 100);
  });
}
