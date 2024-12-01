import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import socketService from "../../services/socket";
import { withRouter } from "../../utils/withRouter";

class Game extends React.PureComponent {
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
    const room = rooms[roomCode];

    if (!room) {
      return null;
    }

    const { players } = room;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box display="grid" justifyContent="center">
          <Text fontWeight="bold" fontStyle="italic" fontSize="42px">
            {roomCode}
          </Text>
          <Box display="flex" gap="16px" flexWrap="wrap">
            {map(players, (player) => (
              <Box
                key={player.id}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                {player.avatar && (
                  <Box
                    alt={player.name}
                    bg={player.avatar}
                    borderRadius="50%"
                    borderStyle="solid"
                    borderWidth={1}
                    size={48}
                  />
                )}
                <Text>{player.name}</Text>
                {player.is_host && <Text fontSize="12px">(Host)</Text>}
              </Box>
            ))}
          </Box>
        </Box>
      </>
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
