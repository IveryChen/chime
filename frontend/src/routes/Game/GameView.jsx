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
import playSnippet from "./playSnippet";
import Scoreboard from "./Scoreboard";

class GameView extends React.PureComponent {
  state = {
    finalRanking: null,
    isPlaying: false,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
  };

  onChangeIsPlaying = (isPlaying) => this.setState({ isPlaying });

  componentDidMount() {
    const { roomCode } = this.props;

    socketService.emit("initialize_game", { roomCode });
    socketService.on("game_state_update", this.handleGameStateUpdate);
    socketService.on("score_update", this.handleScoreUpdate);
    socketService.on("game_over", this.handleGameOver);
    socketService.on("play_snippet", this.handlePlaySnippet);

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const audio = new Audio();
      audio.play().catch(() => {});
    }
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);
    socketService.off("score_update", this.handleScoreUpdate);
    socketService.off("game_over", this.handleGameOver);
    socketService.off("play_snippet", this.handlePlaySnippet);

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
    const { gameState, scores, finalRanking } = data;
    state.select("games", "gameState").set(gameState);
    this.setState({
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
  };

  handleScoreUpdate = (data) => {
    const { scores, lastGuess } = data;

    state.select("games", "gameState").merge({
      lastGuess,
      scores,
      showAnswer: true,
    });
  };

  handlePlaySnippet = async (data) => {
    const { currentSongUri } = data;
    if (!currentSongUri) return;

    this.setState({ isPlaying: true });
    await playSnippet(currentSongUri);
    this.setState({
      isPlaying: false,
      showReplayButton: true,
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
              const { roomCode } = this.props;
              socketService.emit("request_play_snippet", { roomCode });
            }
          );
        }, 3000);
      }
    );
  };

  render() {
    const { gameState, roomCode, user } = this.props;
    const {
      finalRanking,
      isPlaying,
      showPlayerName,
      showReplayButton,
      showRoundText,
    } = this.state;

    if (!gameState) {
      return null;
    }

    if (gameState.isGameOver) {
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
          gridTemplateRows={gameState.showAnswer ? "auto 1fr" : "auto 1fr auto"}
        >
          <Players />
          {gameState.showAnswer ? (
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
                gameState={gameState}
                isCurrentPlayersTurn={isCurrentPlayersTurn}
                isPlaying={isPlaying}
                showPlayerName={showPlayerName}
                showReplayButton={showReplayButton}
                showRoundText={showRoundText}
                onReplay={() =>
                  socketService.emit("request_play_snippet", { roomCode })
                }
              />
              {isCurrentPlayersTurn && (
                <Guess
                  gameState={gameState}
                  onChangeAnswer={this.onChangeAnswer}
                  roomCode={roomCode}
                />
              )}
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
