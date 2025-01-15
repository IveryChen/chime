import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";

import Box from "../Box";
import Text from "../Text";

import Player from "./Player";

class Players extends React.PureComponent {
  render() {
    const { currentRoom, gameState, submittedPlayers = new Set() } = this.props;
    const { status: gameStatus } = currentRoom;
    const isPlaying = gameStatus === "playing";

    if (!gameState || !currentRoom?.players) {
      return null;
    }

    const { currentPlayer, scores = {} } = gameState;
    const { players } = currentRoom;

    return (
      <Box
        alignSelf="start"
        display="flex"
        gap="8px"
        gridTemplateColumns="repeat(auto-fill, minmax(1fr))"
        justifyContent="center"
      >
        {map(players, (player) => {
          const { id } = player;
          const score = scores[id] || 0;

          return (
            <Box
              alignContent="center"
              display="grid"
              justifyItems="center"
              key={id}
            >
              <Player
                opacity={isPlaying || submittedPlayers.has(id)}
                player={player}
                size={currentPlayer && id === currentPlayer.id ? 56 : 36}
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
  { currentRoom: ["games", "currentRoom"], gameState: ["games", "gameState"] },
  Players
);
