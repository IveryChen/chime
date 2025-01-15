import { branch } from "baobab-react/higher-order";
import React from "react";
import { Async } from "react-async";

import fetchPlaylists from "../../api/fetchPlaylists";
import Box from "../../components/Box";
import socketService from "../../services/socket";
import state from "../../state";
import { withRouter } from "../../utils/withRouter";

import GameView from "./GameView";
import LobbyView from "./LobbyView";
import PlaylistView from "./PlaylistView";
import WaitingView from "./WaitingView";

class Game extends React.PureComponent {
  componentDidMount() {
    const { roomCode } = this.props.params;
    const { currentRoom, user } = this.props;

    if (!currentRoom || !user?.player) {
      window.location.href = "/";
      return;
    }

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
    socketService.on("room-status-update", this.handleRoomStatusUpdate);
  }

  componentWillUnmount() {
    const { roomCode } = this.props.params;
    const isRefreshing = localStorage.getItem("gameRoom") !== null;

    if (!isRefreshing) {
      socketService.leaveRoom(roomCode);
      socketService.disconnect();
    }

    socketService.off("players-update", this.handlePlayersUpdate);
    socketService.off("room-status-update", this.handleRoomStatusUpdate);
  }

  handlePlayersUpdate = (data) => {
    const { players } = data;
    state.select("games", "currentRoom", "players").set(players);
  };

  handleRoomStatusUpdate = (data) => {
    const { status } = data;
    state.select("games", "currentRoom", "status").set(status);
  };

  updateGameStage = (newStatus) => {
    const { roomCode } = this.props.params;
    socketService.updateRoomStatus(roomCode, newStatus);
  };

  render() {
    const { roomCode } = this.props.params;
    const { currentRoom, user } = this.props;

    if (!currentRoom) {
      return null;
    }

    const { status } = currentRoom;
    const { player } = user;
    const hasSpotifyToken = Boolean(
      localStorage.getItem("spotify_access_token")
    );

    return (
      <Box display="grid" gridTemplateRows="auto 1fr" height="100%">
        {status === "waiting" && (
          <LobbyView
            onUpdateGameStage={this.updateGameStage}
            roomCode={roomCode}
          />
        )}
        {status === "selecting_playlist" &&
          (hasSpotifyToken ? (
            <Async
              promiseFn={fetchPlaylists}
              spotifyToken={player.spotify_token}
            >
              {this.renderPlaylist}
            </Async>
          ) : (
            <WaitingView roomCode={roomCode} />
          ))}
        {status === "playing" && (
          <GameView
            onUpdateGameStage={this.updateGameStage}
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
        onUpdateGameStage={this.updateGameStage}
        players={players}
        playlists={playlists}
        playerId={player.id}
        roomCode={roomCode}
      />
    );
  };
}

export default withRouter(
  branch({ currentRoom: ["games", "currentRoom"], user: ["user"] }, Game)
);
