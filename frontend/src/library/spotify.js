import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const initializeSpotify = () => {
  // First check localStorage
  const storedToken = localStorage.getItem("spotify_access_token");
  if (storedToken) {
    spotifyApi.setAccessToken(storedToken);

    return spotifyApi;
  }

  // Then check URL params
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");

  if (accessToken) {
    localStorage.setItem("spotify_access_token", accessToken);
    spotifyApi.setAccessToken(accessToken);
  }

  return spotifyApi;
};

export default spotifyApi;
