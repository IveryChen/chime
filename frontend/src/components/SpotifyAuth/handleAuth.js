import spotifyApi from "../../library/spotify";
import { api } from "../../library/api";

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
    const data = await api.get("/auth/login");

    if (data.url) {
      window.location.href = data.url;
      return { redirectToLogin: true };
    } else {
      throw new Error("No login URL received");
    }
  } catch (error) {
    console.error("Login error:", error); // Debug
    throw new Error("Failed to get login URL");
  }
}
