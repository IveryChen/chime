import { apiClient } from "../../api/apiClient";
import spotifyApi from "../../library/spotify";
import getPlatform from "../../utils/getPlatform";

export default async function handleAuth() {
  const storedToken = localStorage.getItem("spotify_access_token");

  if (storedToken) {
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
    const data = await apiClient.get("/auth/login");

    if (!data.url) {
      throw new Error("No login URL received");
    }

    const platform = getPlatform();
    console.log(platform);

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
        return new Promise((resolve) => {
          const checkPopup = setInterval(() => {
            const popupUrl = popup.location.href;
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
      } else {
        window.location.href = data.url;
      }
    }

    return { redirectToLogin: true };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to get login URL");
  }
}
