import { Component } from "react";
import { Async } from "react-async";

import handleCreateGame from "../../api/handleCreateGame";
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

  onChangeRoomCode = () => {};

  onChangeHideJoinGame = () => this.setState({ showJoinGame: false });

  onChangeShowJoinGame = () => this.setState({ showJoinGame: true });

  onChangeHideCreateGame = () => this.setState({ showCreateGame: false });

  onChangeShowCreateGame = () => this.setState({ showCreateGame: true });

  onCreateGameError = (error) => this.setState({ error: error.message });

  onCreateGameSuccess = (gameData) =>
    (window.location.href = `/game/${gameData.roomCode}`);

  render() {
    return <Async promiseFn={loadUserProfile}>{this.renderBody}</Async>;
  }

  renderBody = ({ data: user, error, isPending }) => {
    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>No user data found</div>;

    const handleCreateGameClick = async () => {
      const { playerName } = this.state;
      if (!playerName.trim()) {
        throw new Error("Please enter your name");
      }

      const spotifyToken = localStorage.getItem("spotify_access_token");

      if (!spotifyToken) {
        throw new Error("Spotify authentication required");
      }

      return handleCreateGame(playerName, spotifyToken);
    };

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
              onClick={this.onChangeShowJoinGame}
            >
              Join a Game
            </button>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-lg"
              onClick={this.onChangeShowCreateGame}
            >
              Create a Game
            </button>
          </Box>
        )}
        {this.state.showJoinGame && (
          <form onSubmit={this.handleJoinGame}>
            <Box>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.playerName}
                onChange={(e) => this.setState({ playerName: e.target.value })}
                required
              />
            </Box>
            <Box>
              <input
                type="text"
                placeholder="Enter room code"
                value={this.state.roomCode}
                onChange={(e) =>
                  this.setState({
                    roomCode: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </Box>
            <button type="submit">Join Game</button>
            <button type="button" onClick={this.onChangeHideJoinGame}>
              Back
            </button>
          </form>
        )}
        {this.state.showCreateGame && (
          <Box>
            <Box>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.playerName}
                onChange={(e) => this.setState({ playerName: e.target.value })}
                required
              />
            </Box>
            <Async
              deferFn={handleCreateGameClick}
              onResolve={this.onCreateGameSuccess}
              onReject={this.onCreateGameError}
            >
              {({ isPending, run }) => (
                <>
                  <button onClick={run} disabled={isPending}>
                    {isPending ? "Creating..." : "Create Game"}
                  </button>
                  <button
                    onClick={this.onChangeHideCreateGame}
                    disabled={isPending}
                  >
                    Back
                  </button>
                </>
              )}
            </Async>
          </Box>
        )}
        {this.state.error && (
          <div className="mt-4 text-red-500 text-center">
            {this.state.error}
          </div>
        )}
      </Box>
    );
  };
}
