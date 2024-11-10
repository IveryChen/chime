import { Component } from "react";
import { Async } from "react-async";

import Box from "../../components/Box";

import loadUserProfile from "./loadUserProfile";

export default class Lobby extends Component {
  state = {
    showJoinGame: false,
    showCreateGame: false,
    roomCode: "",
    playerName: "",
    error: null,
  };

  render() {
    return (
      <Async promiseFn={loadUserProfile}>
        {({ data: user, error, isPending }) => {
          if (isPending) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;
          if (!user) return <div>No user data found</div>;

          return (
            <Box>
              <Box>
                {user.images?.[0]?.url && (
                  <img src={user.images[0].url} alt="Profile" />
                )}
                <p>{user.display_name}</p>
              </Box>
              {!this.state.showJoinGame && !this.state.showCreateGame && (
                <Box display="flex" gap="4px" justifyContent="center">
                  <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                    onClick={() => this.setState({ showJoinGame: true })}
                  >
                    Join a Game
                  </button>
                  <button
                    className="bg-green-500 text-white px-6 py-3 rounded-lg"
                    onClick={() => this.setState({ showCreateGame: true })}
                  >
                    Create a Game
                  </button>
                </Box>
              )}
            </Box>
          );
        }}
      </Async>
    );
  }
}
