import React from "react";
import { branch } from "baobab-react/higher-order";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import socketService from "../../services/socket";
import { withRouter } from "../../utils/withRouter";

class Game extends React.PureComponent {
  componentDidMount() {
    const { roomCode } = this.props.params;
    const { user } = this.props;
    // Connect to your multiplayer socket here using the roomCode
    // Example: socket.emit('join-room', roomCode);
    socketService.connect();

    socketService.joinRoom(roomCode, {
      id: user.id,
      name: user.display_name,
      avatar: user.images?.[0]?.url,
      spotify_token: localStorage.getItem("spotify_access_token"),
      is_host: false,
    });
  }

  componentWillUnmount() {
    const { roomCode } = this.props.params;
    socketService.leaveRoom(roomCode);
    socketService.disconnect();
  }

  render() {
    const { roomCode } = this.props.params;
    const { players } = this.props;

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
            {players?.map((player) => (
              <Box
                // key={player.id}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                {/* {player.avatar && (
                  <Box
                    as="img"
                    src={player.avatar}
                    alt={player.name}
                    size={48}
                    borderRadius="50%"
                  />
                )} */}
                {/* <Text>{player.name}</Text> */}
                {/* {player.is_host && <Text fontSize="12px">(Host)</Text>} */}
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
      user: ["user"],
      players: ["game", "players"],
      gameState: ["game", "state"],
    },
    Game
  )
);
