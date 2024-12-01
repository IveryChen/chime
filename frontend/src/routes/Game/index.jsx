import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import socketService from "../../services/socket";
import { withRouter } from "../../utils/withRouter";

import LobbyView from "./LobbyView";

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
        <Header>
          <Logo />
        </Header>
        {gameStage === "lobby" && (
          <LobbyView players={players} roomCode={roomCode} />
        )}
      </Box>
    );
  }
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
