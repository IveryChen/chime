import React from "react";

import Box from "../../components/Box";
import DotsVisualizer from "../../components/DotsVisualizer";
import Text from "../../components/Text";

import ReplayButton from "./ReplayButton";

export default class Turn extends React.PureComponent {
  render() {
    const {
      deviceId,
      gameState,
      isPlaying,
      onChangeIsPlaying,
      previewType,
      showPlayerName,
      showReplayButton,
      showRoundText,
      spotifyPlayer,
    } = this.props;

    if (!gameState) {
      return null;
    }

    return (
      <Box>
        {showRoundText && (
          <Text fontSize="32px" fontWeight="bold" textAlign="center">
            Round {gameState.currentRound}
          </Text>
        )}
        {showPlayerName && (
          <Text fontSize="24px" textAlign="center">
            {gameState.currentPlayer.name}&apos;s Turn
          </Text>
        )}
        <Box
          display="grid"
          gridTemplateRows="100px 1fr"
          justifyContent="center"
        >
          <DotsVisualizer isPlaying={isPlaying} />
          {showReplayButton && (
            <ReplayButton
              deviceId={deviceId}
              currentSong={gameState.currentSong}
              isPlaying={isPlaying}
              onChangeIsPlaying={onChangeIsPlaying}
              previewType={previewType}
              spotifyPlayer={spotifyPlayer}
            />
          )}
        </Box>
      </Box>
    );
  }
}
