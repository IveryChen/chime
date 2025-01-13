import React from "react";

import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";
import { theme } from "../../constants/constants";
import socketService from "../../services/socket";

import Answer from "./Answer";
import Guess from "./Guess";
import GameStatus from "./GameStatus";
import Turn from "./Turn";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";
import Scoreboard from "./Scoreboard";

export default class GameView extends React.PureComponent {
  state = {
    answer: false,
    deviceId: null,
    finalRanking: null,
    gameState: null,
    isGameOver: false,
    isPlaying: false,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
    spotifyPlayer: null,
    submitStatus: null,
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
    socketService.on("players-update", this.handlePlayersUpdate);

    initializeSpotifySDK(this.onChangeDeviceId, this.onChangeSpotifyPlayer);
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);
    socketService.off("score_update", this.handleScoreUpdate);
    socketService.off("game_over", this.handleGameOver);
    socketService.off("players-update", this.handlePlayersUpdate);

    if (this.state.spotifyPlayer) {
      this.state.spotifyPlayer.disconnect();
    }
  }

  handlePlayersUpdate = (data) => {
    const { players } = data;
    console.log("players", players);
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        players,
      },
    }));
    console.log("new players", this.state.gameState);
  };

  handleGameStateUpdate = (data) => {
    const { gameState } = data;
    this.setState({ gameState }, () => {
      this.startRoundSequence();
    });
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

  handleNextRound = () => {
    const { roomCode } = this.props;
    socketService.emit("start_new_round", { roomCode });
    this.setState({ answer: false });
  };

  handleScoreUpdate = (data) => {
    const { scores, lastGuess } = data;
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        lastGuess,
        scores,
      },
      answer: true,
    }));
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
    const { players, roomCode } = this.props;
    const {
      answer,
      deviceId,
      finalRanking,
      gameState,
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
          roomCode={roomCode}
        />
      );
    }

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box
          display="grid"
          gridTemplateRows={answer ? "auto 1fr" : "32% 1fr auto"}
        >
          <Players data={players} gameState={gameState} />
          {answer ? (
            <>
              <Answer gameState={gameState} />
              <IconButton
                bg={theme.blue}
                justifySelf="end"
                label="NEXT"
                onClick={this.handleNextRound}
              />
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
