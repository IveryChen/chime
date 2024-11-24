import React from "react";
import { branch } from "baobab-react/higher-order";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import { withRouter } from "../../utils/withRouter";

class Game extends React.PureComponent {
  componentDidMount() {
    // const { roomCode } = this.props.params;
    // Connect to your multiplayer socket here using the roomCode
    // Example: socket.emit('join-room', roomCode);
  }

  componentWillUnmount() {
    // Cleanup socket connection when leaving
    // Example: socket.emit('leave-room', roomCode);
  }

  render() {
    const { roomCode } = this.props.params;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box display="grid" justifyContent="center">
          <Text fontWeight="bold" fontStyle="italic" fontSize="42px">
            {roomCode}
          </Text>
          <Box display="flex" gap="16px" flexWrap="wrap"></Box>
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
