import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import DotsVisualizer from "../../components/DotsVisualizer";

import ReplayButton from "./ReplayButton";
import Animation from "./Animation";

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

    if (!gameState || !gameState.currentPlayer) {
      return null;
    }

    const players = currentRoom.players;
    const displayRound = Math.ceil(gameState.currentRound / players.length);

    return (
      <Box alignItems="center" display="grid">
        {isPlaying ? (
          isCurrentPlayersTurn && (
            <Box alignContent="center" display="grid" justifyContent="center">
              {showReplayButton ? (
                <ReplayButton
                  isPlaying={isPlaying}
                  onReplay={onReplay}
                  showPlay={showPlay}
                />
              ) : (
                <DotsVisualizer isPlaying={isPlaying} />
              )}
            </Box>
          )
        ) : (
          <Animation
            name={gameState.currentPlayer.name}
            round={displayRound}
            showPlayerName={showPlayerName}
            showRoundText={showRoundText}
          />
        )}
      </Box>
    );
  }
}

export default branch({ currentRoom: ["games", "currentRoom"] }, Turn);
