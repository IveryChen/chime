import React from "react";
import { branch } from "baobab-react/higher-order";

import Header from "../../components/Header";
import Logo from "../../components/Logo";
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
        <h1>Game Room: {roomCode}</h1>
        {/* Your game UI */}
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
