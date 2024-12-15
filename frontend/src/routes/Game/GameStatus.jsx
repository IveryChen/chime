import React from "react";

import Box from "../../components/Box";
import Status from "../../components/Status";
import Text from "../../components/Text";

export default class GameStatus extends React.PureComponent {
  render() {
    const { gameState, roomCode } = this.props;

    if (!gameState) {
      return null;
    }

    return (
      <Box cursor="pointer" display="grid">
        <Text fontFamily="Oswald" fontSize={16} lineHeight={1}>
          {roomCode}
        </Text>
        <Status data={gameState.currentRound} />
      </Box>
    );
  }
}
