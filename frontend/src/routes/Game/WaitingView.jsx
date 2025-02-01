import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Text from "../../components/Text";
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
          <Text>Waiting for host to select songs...</Text>
        </Box>
      </>
    );
  }
}

export default withRouter(
  branch({ gameState: ["games", "gameState"] }, WaitingView)
);
