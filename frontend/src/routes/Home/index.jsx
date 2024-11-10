import { Component } from "react";
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to Chime</h1>
        <Link to="/spotify-auth">
          <button>Login with Spotify</button>
        </Link>
      </div>
    );
  }
}
