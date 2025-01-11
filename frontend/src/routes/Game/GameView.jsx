import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Players from "../../components/Players";
import socketService from "../../services/socket";

import Answer from "./Answer";
import Guess from "./Guess";
import GameStatus from "./GameStatus";
import Turn from "./Turn";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";

export default class GameView extends React.PureComponent {
  state = {
    answer: false,
    currentGuess: null,
    deviceId: null,
    gameState: null,
    isPlaying: false,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
    spotifyPlayer: null,
    submitStatus: null,
  };

  onChangeAnswer = (answer) => this.setState({ answer });

  onChangeCurrentGuess = (currentGuess) => this.setState({ currentGuess });

  onChangeDeviceId = (deviceId) => this.setState({ deviceId });

  onChangeSpotifyPlayer = (spotifyPlayer) => this.setState({ spotifyPlayer });

  onChangeIsPlaying = (isPlaying) => this.setState({ isPlaying });

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

  playInitialSnippet = async () => {
    const { deviceId, gameState, spotifyPlayer } = this.state;
    const currentSongUri =
      gameState?.currentSong?.uri || gameState?.currentSong?.preview_url;

    if (currentSongUri && deviceId && spotifyPlayer) {
      this.setState({ isPlaying: true });

      await playSnippet(deviceId, spotifyPlayer, currentSongUri);

      this.setState({
        isPlaying: false,
        showReplayButton: true,
      });
    }
  };

  render() {
    const { players, roomCode } = this.props;
    const {
      answer,
      currentGuess,
      deviceId,
      gameState,
      isPlaying,
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
        <Box display="grid" gridTemplateRows="32% 1fr auto">
          <Players data={players} />
          {answer ? (
            <Answer currentGuess={currentGuess} gameState={gameState} />
          ) : (
            <>
              <Turn
                currentSongUri={currentSongUri}
                deviceId={deviceId}
                gameState={gameState}
                isPlaying={isPlaying}
                onChangeIsPlaying={this.onChangeIsPlaying}
                showPlayerName={showPlayerName}
                showReplayButton={showReplayButton}
                showRoundText={showRoundText}
                spotifyPlayer={spotifyPlayer}
              />
              <Guess
                gameState={gameState}
                onChangeAnswer={this.onChangeAnswer}
                onChangeCurrentGuess={this.onChangeCurrentGuess}
                roomCode={roomCode}
              />
            </>
          )}
        </Box>
      </>
    );
  }
}
