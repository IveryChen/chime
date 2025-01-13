import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";

import Box from "../Box";
import Text from "../Text";

import Player from "./Player";

class Players extends React.PureComponent {
  render() {
    const { gameState, gameStatus, submittedPlayers = new Set() } = this.props;
    const isPlaying = gameStatus === "playing";

    if (!gameState) {
      return null;
    }

    const { currentPlayer, players, scores } = gameState;

    return (
      <Box
        display="grid"
        gap="16px"
        gridTemplateColumns="repeat(auto-fill, minmax(1fr))"
      >
        {map(players, (player) => {
          const { id } = player;
          const score = scores[id];

          return (
            <Box
              alignContent="start"
              display="grid"
              justifyItems="center"
              key={id}
            >
              <Player
                isTurn={id === currentPlayer.id}
                opacity={isPlaying || submittedPlayers.has(id)}
                player={player}
              />
              {score > 0 && <Text fontStyle="italic">+{score}</Text>}
            </Box>
          );
        })}
      </Box>
    );
  }
}

export default branch(
  { gameStatus: ["games", "currentRoom", "status"] },
  Players
);
