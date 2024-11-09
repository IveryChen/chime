import React, { Component } from "react";
import spotifyApi, { initializeSpotify } from "../lib/spotify";

class SpotifyAuth extends Component {
  componentDidMount() {
    this.handleInitialAuth();
  }

  handleInitialAuth = async () => {
    const spotify = initializeSpotify();
    if (!spotify.getAccessToken()) {
      await this.handleLogin();
    }
  };

  handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login");
      const data = await response.json();
      // Redirect to Spotify login
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to get login URL:", error);
    }
  };

  render() {
    return <div>my Auth UI</div>;
  }
}

export default SpotifyAuth;
