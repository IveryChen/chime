import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";

import Box from "../../components/Box";

import Player from "./Player";

class Players extends React.PureComponent {
  render() {
    const {
      data,
      gameState,
      gameStatus,
      submittedPlayers = new Set(),
    } = this.props;
    const isPlaying = gameStatus === "playing";

    // TODO: show scores
    // const playerScore = gameState.scores[player.id]

    return (
      <Box
        display="grid"
        gap="16px"
        gridTemplateColumns="repeat(auto-fill, minmax(1fr))"
      >
        {map(data, (player) => (
          <Player
            isTurn={player.id === gameState.currentPlayer.id}
            opacity={isPlaying || submittedPlayers.has(player.id)}
            player={player}
          />
        ))}
      </Box>
    );
  }
}

export default branch(
  { gameStatus: ["games", "currentRoom", "status"] },
  Players
);
