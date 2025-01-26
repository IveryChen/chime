import { apiClient } from "../../api/apiClient";
import spotifyApi from "../../library/spotify";

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

    window.location.href = data.url;
    return { redirectToLogin: true };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to get login URL");
  }
}
