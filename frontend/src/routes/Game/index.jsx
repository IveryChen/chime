import { branch } from "baobab-react/higher-order";
import React from "react";
import { Async } from "react-async";

import fetchPlaylists from "../../api/fetchPlaylists";
import Box from "../../components/Box";
import socketService from "../../services/socket";
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

    socketService.joinRoom(roomCode, {
      id: currentRoom.host.id,
      name: currentRoom.host.name,
      avatar: currentRoom.host.avatar,
      spotify_token: localStorage.getItem("spotify_access_token"),
      is_host: currentRoom.host.is_host,
    });
  }

  componentWillUnmount() {
    const { roomCode } = this.props.params;
    socketService.leaveRoom(roomCode);
    socketService.disconnect();
  }

  onChangeGameStage = (gameStage) => this.setState({ gameStage });

  render() {
    const { roomCode } = this.props.params;
    const { currentRoom } = this.props;
    const { gameStage } = this.state;

    if (!currentRoom) {
      return null;
    }

    const { players } = currentRoom;

    return (
      <Box display="grid" gridTemplateRows="auto 1fr" height="100%">
        {gameStage === "lobby" && (
          <LobbyView
            onChangeGameStage={this.onChangeGameStage}
            players={players}
            roomCode={roomCode}
          />
        )}
        {gameStage === "playlist" && (
          <Async
            promiseFn={fetchPlaylists}
            spotifyToken={localStorage.getItem("spotify_access_token")}
          >
            {this.renderPlaylist}
          </Async>
        )}
        {gameStage === "game" && (
          <GameView
            onChangeGameStage={this.onChangeGameStage}
            players={players}
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
      currentRoom: ["games", "currentRoom"],
      user: ["user"],
    },
    Game
  )
);
