import spotifyApi from "../library/spotify";

export default async function loadUserProfile() {
  try {
    const userData = await spotifyApi.getMe();
    return userData;
  } catch (error) {
    throw new Error("Failed to load user profile", error);
  }
}
