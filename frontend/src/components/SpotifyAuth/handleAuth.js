import { apiClient } from "../../api/apiClient";
import spotifyApi from "../../library/spotify";
import detectSpotifyApp from "../../utils/detectSpotifyApp";
import getPlatform from "../../utils/getPlatform";

export default async function handleAuth() {
  console.time("auth-flow");

  const storedToken = localStorage.getItem("spotify_access_token");

  if (storedToken) {
    console.timeEnd("auth-flow");

    spotifyApi.setAccessToken(storedToken);
    return { isAuthenticated: true };
  }

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");

  if (accessToken) {
    localStorage.setItem("spotify_access_token", accessToken);
    spotifyApi.setAccessToken(accessToken);

    return { isAuthenticated: true };
  }

  try {
    console.time("api-call");
    const data = await apiClient.get("/auth/login");
    console.timeEnd("api-call");

    if (!data.url) {
      throw new Error("No login URL received");
    }

    const platform = getPlatform();
    console.log("Detected platform:", platform);

    // Handle Desktop platforms
    if (platform === "Desktop") {
      const width = 450;
      const height = 730;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        data.url,
        "Spotify Login",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (popup) {
        console.log("Popup opened successfully");
        return new Promise((resolve) => {
          console.log("Starting popup check interval");

          const checkPopup = setInterval(() => {
            const popupUrl = popup.location.href;
            console.log("Current popup URL:", popupUrl);

            if (popupUrl.includes("access_token")) {
              const popupParams = new URLSearchParams(
                popup.location.hash.substring(1)
              );
              const token = popupParams.get("access_token");

              localStorage.setItem("spotify_access_token", token);
              spotifyApi.setAccessToken(token);

              clearInterval(checkPopup);
              popup.close();
              resolve({ isAuthenticated: true });
            }
          }, 100);
        });
      }
    } else {
      console.log("Starting mobile auth flow");

      // Handle mobile platforms
      const hasSpotifyApp = await detectSpotifyApp();
      console.log("Spotify app detected:", hasSpotifyApp);

      if (hasSpotifyApp) {
        console.log("Using Spotify app deep link");

        // Convert web URL to app URL
        const spotifyAuthUrl = data.url.replace(
          "https://accounts.spotify.com",
          "spotify://accounts.spotify.com"
        );

        // Try deep linking first
        window.location.href = spotifyAuthUrl;

        // Fallback to web auth after delay if app doesn't open
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        console.log("Using web auth flow");

        // Direct to web auth if no app
        window.location.href = data.url;
      }
    }

    console.log("Falling through to redirect");

    return { redirectToLogin: true };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to get login URL");
  }
}
