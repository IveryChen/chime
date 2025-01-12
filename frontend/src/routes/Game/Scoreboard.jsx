import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Text from "../../components/Text";

import GameStatus from "./GameStatus";

export default class Scoreboard extends React.PureComponent {
  render() {
    const { finalRanking, gameState, roomCode } = this.props;

    if (!gameState) {
      return null;
    }

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box display="grid" gap="24px">
          <Text variant="h1">Game Over!</Text>
          <Box display="grid" gap="16px">
            <Text variant="h2">Final Ranking:</Text>
            {finalRanking.map((player, index) => (
              <Box
                key={player.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text>
                  {index + 1}. {player.name}
                </Text>
                <Text>{player.score} points</Text>
              </Box>
            ))}
          </Box>
          {/* Add any "Play Again" or "Back to Lobby" buttons here */}
        </Box>
      </>
    );
  }
}
