import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Async } from "react-async";
import spotifyApi, { initializeSpotify } from "../../library/spotify";

const handleAuth = async () => {
  const spotify = initializeSpotify();
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");

  if (accessToken) {
    // Store token in localStorage
    localStorage.setItem("spotify_access_token", accessToken);
    spotifyApi.setAccessToken(accessToken);
    return { isAuthenticated: true };
  }

  // Check for error
  const error = params.get("error");
  if (error) {
    throw new Error(`Authentication failed: ${error}`);
  }

  // If no token and no error, start login process
  if (!spotify.getAccessToken()) {
    const response = await fetch("http://localhost:3000/login");
    const data = await response.json();
    window.location.href = data.url;
    return { redirectToLogin: true };
  }

  return { isAuthenticated: false };
};

export default class SpotifyAuth extends Component {
  render() {
    return (
      <Async promiseFn={handleAuth}>
        {({ data, error, isPending }) => {
          if (isPending) {
            return <div>Loading...</div>;
          }

          if (error) {
            return <div>Error: {error.message}</div>;
          }

          if (data.isAuthenticated) {
            return <Navigate to="/lobby" replace />;
          }

          if (data.redirectToLogin) {
            return <div>Redirecting to Spotify login...</div>;
          }

          return null;
        }}
      </Async>
    );
  }
}
