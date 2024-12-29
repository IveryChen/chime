import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";
import Text from "../../components/Text";
import socketService from "../../services/socket";

import GameStatus from "./GameStatus";
import ReplayButton from "./ReplayButton";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";

export default class GameView extends React.PureComponent {
  state = {
    deviceId: null,
    gameState: null,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
    spotifyPlayer: null,
  };

  onChangeDeviceId = (deviceId) => this.setState({ deviceId });

  onChangeSpotifyPlayer = (spotifyPlayer) => this.setState({ spotifyPlayer });

  componentDidMount() {
    const { roomCode } = this.props;

    socketService.emit("initialize_game", { roomCode });
    socketService.on("game_state_update", this.handleGameStateUpdate);

    initializeSpotifySDK(this.onChangeDeviceId, this.onChangeSpotifyPlayer);
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);

    if (this.state.spotifyPlayer) {
      this.state.spotifyPlayer.disconnect();
    }
  }

  handleGameStateUpdate = (data) => {
    const { gameState } = data;
    this.setState({ gameState }, () => {
      this.startRoundSequence();
    });
  };

  startRoundSequence = () => {
    // Reset states
    this.setState(
      {
        showRoundText: false,
        showPlayerName: false,
        showReplayButton: false,
      },
      () => {
        // Show round number
        this.setState({ showRoundText: true });

        // After 1 second, show player name
        setTimeout(() => {
          this.setState({ showPlayerName: true });
        }, 1000);

        // After 3 seconds, hide intro texts and play song
        setTimeout(() => {
          this.setState(
            {
              showRoundText: false,
              showPlayerName: false,
            },
            () => {
              this.playInitialSnippet();
            }
          );
        }, 3000);
      }
    );
  };

  playInitialSnippet = () => {
    const { deviceId, gameState, spotifyPlayer } = this.state;
    const currentSongUri =
      gameState?.currentSong?.uri || gameState?.currentSong?.preview_url;

    if (currentSongUri && deviceId && spotifyPlayer) {
      playSnippet(deviceId, spotifyPlayer, currentSongUri);

      setTimeout(() => {
        this.setState({ showReplayButton: true });
      }, 2000);
    }
  };

  render() {
    const { players, roomCode } = this.props;
    const {
      deviceId,
      gameState,
      showPlayerName,
      showReplayButton,
      showRoundText,
      spotifyPlayer,
    } = this.state;

    if (!gameState) {
      return null;
    }

    const currentSongUri =
      gameState.currentSong.uri || gameState.currentSong.preview_url;

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box display="grid" gridTemplateRows="1fr 1fr auto">
          <Players data={players} />
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
            {showReplayButton && (
              <ReplayButton
                currentSongUri={currentSongUri}
                deviceId={deviceId}
                spotifyPlayer={spotifyPlayer}
              />
            )}
          </Box>
          <IconButton
            bg={theme.blue}
            Icon={LiaArrowRightSolid}
            justifySelf="end"
            label="SPEAK TO GUESS"
          />
        </Box>
      </>
    );
  }
}
