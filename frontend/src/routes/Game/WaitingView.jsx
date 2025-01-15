import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import { withRouter } from "../../utils/withRouter";

import GameStatus from "./GameStatus";

class WaitingView extends React.PureComponent {
  render() {
    const { gameState, roomCode } = this.props;

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box
          alignItems="center"
          display="flex"
          height="100%"
          justifyContent="center"
        >
          <div>Waiting for host to select songs...</div>
        </Box>
      </>
    );
  }
}

export default withRouter(
  branch({ gameState: ["games", "gameState"] }, WaitingView)
);
