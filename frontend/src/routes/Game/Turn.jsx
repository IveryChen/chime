import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import DotsVisualizer from "../../components/DotsVisualizer";
import Text from "../../components/Text";

import ReplayButton from "./ReplayButton";

class Turn extends React.PureComponent {
  render() {
    const {
      currentRoom,
      gameState,
      isCurrentPlayersTurn,
      isPlaying,
      onReplay,
      showPlay,
      showPlayerName,
      showReplayButton,
      showRoundText,
    } = this.props;

    if (!gameState) {
      return null;
    }

    console.log(isPlaying);

    const players = currentRoom.players;
    const displayRound = Math.ceil(gameState.currentRound / players.length);

    return (
      <>
        {isCurrentPlayersTurn ? (
          <Box alignContent="center" display="grid" justifyContent="center">
            {showReplayButton ? (
              <ReplayButton
                isPlaying={isPlaying}
                showPlay={showPlay}
                showPlayonReplay={onReplay}
              />
            ) : null}
            <DotsVisualizer
              display={showReplayButton ? "none" : "block"}
              isPlaying={isPlaying}
            />
          </Box>
        ) : (
          <Box>
            {showRoundText && (
              <Text fontSize="32px" fontWeight="bold" textAlign="center">
                Round {displayRound}
              </Text>
            )}
            {showPlayerName && (
              <Text fontSize="24px" textAlign="center">
                {gameState.currentPlayer.name}&apos;s Turn
              </Text>
            )}
          </Box>
        )}
      </>
    );
  }
}

export default branch({ currentRoom: ["games", "currentRoom"] }, Turn);
