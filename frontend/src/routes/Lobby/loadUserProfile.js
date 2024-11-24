import spotifyApi from "../../library/spotify";
import state from "../../state";

export default async function loadUserProfile() {
  try {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    spotifyApi.setAccessToken(token);

    // Try to get user profile
    try {
      const userData = await spotifyApi.getMe();
      state.select("user").set(userData);
    } catch (error) {
      // If we get a 401, token might be expired
      if (error.status === 401) {
        // Clear the invalid token
        localStorage.removeItem("spotify_access_token");
        // Redirect to auth
        window.location.href = "/spotify-auth";
        throw new Error("Token expired, redirecting to login");
      }
      throw error;
    }
  } catch (error) {
    console.error("Profile loading error:", error);
    throw error;
  }
}
