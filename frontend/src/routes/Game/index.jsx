import { branch } from "baobab-react/higher-order";
import React from "react";
import { Async } from "react-async";

import fetchPlaylists from "../../api/fetchPlaylists";
import Box from "../../components/Box";
import socketService from "../../services/socket";
import { withRouter } from "../../utils/withRouter";

import LobbyView from "./LobbyView";
import Playlist from "./PlaylistView";
class Game extends React.PureComponent {
  state = { gameStage: "lobby" };

  componentDidMount() {
    const { roomCode } = this.props.params;
    const { rooms } = this.props;
    const room = rooms[roomCode];

    socketService.connect();

    socketService.joinRoom(roomCode, {
      id: room.host.id,
      name: room.host.name,
      avatar: room.host.avatar,
      spotify_token: localStorage.getItem("spotify_access_token"),
      is_host: room.host.is_host,
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
    const { rooms } = this.props;
    const { gameStage } = this.state;
    const room = rooms[roomCode];

    if (!room) {
      return null;
    }

    const { players } = room;

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
      </Box>
    );
  }

  renderPlaylist = ({ data: playlists, isPending }) => {
    const { roomCode } = this.props.params;
    const { rooms } = this.props;
    const room = rooms[roomCode];
    const { players } = room;

    return (
      <Playlist
        isPending={isPending}
        onChangeGameStage={this.onChangeGameStage}
        players={players}
        playlists={playlists}
        roomCode={roomCode}
      />
    );
  };
}

export default withRouter(
  branch(
    {
      currentRoom: ["games", "currentRoom"],
      rooms: ["games", "rooms"],
      user: ["user"],
    },
    Game
  )
);
