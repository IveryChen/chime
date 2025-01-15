import { branch } from "baobab-react/higher-order";
import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";
import { theme } from "../../constants/constants";
import socketService from "../../services/socket";
import state from "../../state";

import Answer from "./Answer";
import Guess from "./Guess";
import GameStatus from "./GameStatus";
import Turn from "./Turn";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";
import Scoreboard from "./Scoreboard";

class GameView extends React.PureComponent {
  state = {
    answer: false,
    deviceId: null,
    finalRanking: null,
    isGameOver: false,
    isPlaying: false,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
    spotifyPlayer: null,
  };

  onChangeAnswer = (answer) => this.setState({ answer });

  onChangeDeviceId = (deviceId) => this.setState({ deviceId });

  onChangeSpotifyPlayer = (spotifyPlayer) => this.setState({ spotifyPlayer });

  onChangeIsPlaying = (isPlaying) => this.setState({ isPlaying });

  componentDidMount() {
    const { roomCode } = this.props;

    socketService.emit("initialize_game", { roomCode });
    socketService.on("game_state_update", this.handleGameStateUpdate);
    socketService.on("score_update", this.handleScoreUpdate);
    socketService.on("game_over", this.handleGameOver);

    initializeSpotifySDK(this.onChangeDeviceId, this.onChangeSpotifyPlayer);
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);
    socketService.off("score_update", this.handleScoreUpdate);
    socketService.off("game_over", this.handleGameOver);

    if (this.state.spotifyPlayer) {
      this.state.spotifyPlayer.disconnect();
    }
  }

  handleGameStateUpdate = (data) => {
    const { gameState } = data;

    state.select("games", "gameState").set(gameState);
    this.startRoundSequence();
  };

  // TODO: not using finalScores
  handleGameOver = (data) => {
    const { scores, finalRanking } = data;
    this.setState({
      isGameOver: true,
      finalScores: scores,
      finalRanking: finalRanking,
    });
  };

  handleLeaveGame = () => {
    const { roomCode } = this.props;

    localStorage.removeItem("gameRoom");
    socketService.leaveRoom(roomCode);
    socketService.disconnect();
    window.location.href = "/lobby";
  };

  handleNextRound = () => {
    const { roomCode } = this.props;
    socketService.emit("start_new_round", { roomCode });
    this.setState({ answer: false });
  };

  handleScoreUpdate = (data) => {
    const { scores, lastGuess } = data;

    state.select("games", "gameState").merge({
      lastGuess,
      scores,
    });
    this.setState({ answer: true });
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
    const { deviceId, spotifyPlayer } = this.state;
    const { gameState } = this.props;
    const currentSong = gameState?.currentSong;
    const currentSongUri = currentSong?.uri || currentSong?.previewUrl;

    if (currentSongUri && deviceId && spotifyPlayer) {
      this.setState({ isPlaying: true });

      await playSnippet(
        deviceId,
        spotifyPlayer,
        currentSongUri,
        currentSong.previewType
      );

      this.setState({
        isPlaying: false,
        showReplayButton: true,
      });
    }
  };

  render() {
    const { gameState, roomCode, user } = this.props;
    const {
      answer,
      deviceId,
      finalRanking,
      isGameOver,
      isPlaying,
      showPlayerName,
      showReplayButton,
      showRoundText,
      spotifyPlayer,
    } = this.state;

    if (!gameState) {
      return null;
    }

    if (isGameOver) {
      return (
        <Scoreboard
          finalRanking={finalRanking}
          gameState={gameState}
          onLeaveGame={this.handleLeaveGame}
          roomCode={roomCode}
        />
      );
    }

    const isCurrentPlayersTurn =
      user.player?.id === gameState.currentPlayer?.id;

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box
          display="grid"
          gridTemplateRows={answer ? "auto 1fr" : "32% 1fr auto"}
        >
          <Players />
          {answer ? (
            <>
              <Answer gameState={gameState} />
              {isCurrentPlayersTurn && (
                <IconButton
                  bg={theme.blue}
                  justifySelf="end"
                  label="NEXT"
                  onClick={this.handleNextRound}
                />
              )}
            </>
          ) : (
            <>
              <Turn
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
                roomCode={roomCode}
              />
            </>
          )}
        </Box>
      </>
    );
  }
}

export default branch(
  { gameState: ["games", "gameState"], user: ["user"] },
  GameView
);
