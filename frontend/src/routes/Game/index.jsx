import { branch } from "baobab-react/higher-order";
import React from "react";
import { Async } from "react-async";

import fetchPlaylists from "../../api/fetchPlaylists";
import Box from "../../components/Box";
import Text from "../../components/Text";
import socketService from "../../services/socket";
import state from "../../state";
import { withRouter } from "../../utils/withRouter";

import GameView from "./GameView";
import LobbyView from "./LobbyView";
import PlaylistView from "./PlaylistView";

class Game extends React.PureComponent {
  state = { gameStage: "lobby" };

  componentDidMount() {
    const { roomCode } = this.props.params;
    const { currentRoom } = this.props;

    socketService.connect();

    const spotifyToken = localStorage.getItem("spotify_access_token");

    socketService.joinRoom(roomCode, {
      id: currentRoom.host.id,
      name: currentRoom.host.name,
      avatar: currentRoom.host.avatar,
      spotify_token: spotifyToken || null,
      is_host: currentRoom.host.is_host,
    });

    socketService.on("players-update", this.handlePlayersUpdate);
  }

  componentWillUnmount() {
    const { roomCode } = this.props.params;
    socketService.leaveRoom(roomCode);
    socketService.disconnect();

    socketService.off("players-update", this.handlePlayersUpdate);
  }

  handlePlayersUpdate = (data) => {
    const { players } = data;
    state.select("games", "currentRoom", "players").set(players);
  };

  onChangeGameStage = (gameStage) => this.setState({ gameStage });

  render() {
    const { roomCode } = this.props.params;
    const { currentRoom, user } = this.props;
    const { gameStage } = this.state;

    if (!currentRoom) {
      return null;
    }

    const { player } = user;
    const hasSpotifyToken = Boolean(player.spotify_token);

    return (
      <Box display="grid" gridTemplateRows="auto 1fr" height="100%">
        {gameStage === "lobby" && (
          <LobbyView
            onChangeGameStage={this.onChangeGameStage}
            roomCode={roomCode}
          />
        )}
        {gameStage === "playlist" &&
          (hasSpotifyToken ? (
            <Async
              promiseFn={fetchPlaylists}
              spotifyToken={player.spotify_token}
            >
              {this.renderPlaylist}
            </Async>
          ) : (
            <Box
              alignItems="center"
              display="flex"
              height="100%"
              justifyContent="center"
            >
              <Text fontSize="24px" textAlign="center">
                Waiting for host to select songs...
              </Text>
            </Box>
          ))}
        {gameStage === "game" && (
          <GameView
            onChangeGameStage={this.onChangeGameStage}
            roomCode={roomCode}
          />
        )}
      </Box>
    );
  }

  renderPlaylist = ({ data: playlists, isPending }) => {
    const { roomCode } = this.props.params;
    const { currentRoom, user } = this.props;
    const { players } = currentRoom;
    const { player } = user;

    return (
      <PlaylistView
        isPending={isPending}
        onChangeGameStage={this.onChangeGameStage}
        players={players}
        playlists={playlists}
        playerId={player.id}
        roomCode={roomCode}
      />
    );
  };
}

export default withRouter(
  branch(
    {
      gameState: ["games", "gameState"],
      currentRoom: ["games", "currentRoom"],
      user: ["user"],
    },
    Game
  )
);
