import { Component } from "react";
import Async from "react-async";

import { initializeSpotify } from "../../library/spotify";

export default class SpotifyAuth extends Component {
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
      // Fetch login URL from the backend
      const response = await fetch("http://localhost:3000/login");
      const data = await response.json();
      console.log("data.url", data);
      // Redirect to Spotify login
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to get login URL:", error);
    }
  };

  render() {
    return (
      <Async promiseFn={this.handleInitialAuth}>
        {({ data, error, isPending }) => {
          if (isPending) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          if (data) return <p>Spotify authenticated!</p>;
          return null;
        }}
      </Async>
    );
  }
}
