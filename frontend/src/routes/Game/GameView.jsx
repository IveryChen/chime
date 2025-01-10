import React from "react";
import { Async } from "react-async";
import { LiaMicrophoneSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import DotsVisualizer from "../../components/DotsVisualizer";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";
import Players from "../../components/Players";
import Text from "../../components/Text";
import socketService from "../../services/socket";

import GameStatus from "./GameStatus";
import ReplayButton from "./ReplayButton";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";

export default class GameView extends React.PureComponent {
  state = {
    artist: "",
    deviceId: null,
    gameState: null,
    isPlaying: false,
    showPlayerName: false,
    showReplayButton: false,
    showRoundText: false,
    spotifyPlayer: null,
    submitStatus: null,
    title: "",
  };

  onChangeArtist = (artist) => this.setState({ artist });

  onChangeDeviceId = (deviceId) => this.setState({ deviceId });

  onChangeSpotifyPlayer = (spotifyPlayer) => this.setState({ spotifyPlayer });

  onChangeTitle = (title) => this.setState({ title });

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

  handleSubmitGuess = async () => {
    const { artist, gameState, title } = this.state;
    const currentSong = gameState?.currentSong;
    const playerId = gameState?.currentPlayer?.id;

    const normalize = (str) => str.toLowerCase().trim();
    const isArtistCorrect = currentSong.artists.some(
      (artistName) => normalize(artistName) === normalize(artist)
    );
    const isTitleCorrect = normalize(currentSong.name) === normalize(title);

    let score = 0;
    if (isArtistCorrect) score += 1;
    if (isTitleCorrect) score += 1;

    socketService.emit("submit_score", {
      roomCode: this.props.roomCode,
      playerId,
      score: score,
      guess: {
        artist,
        title,
        isArtistCorrect,
        isTitleCorrect,
      },
    });

    this.setState({
      artist: "",
      title: "",
      submitStatus: {
        artist: isArtistCorrect,
        title: isTitleCorrect,
      },
    });
  };

  render() {
    const { players, roomCode } = this.props;
    const {
      artist,
      deviceId,
      gameState,
      isPlaying,
      showPlayerName,
      showReplayButton,
      showRoundText,
      spotifyPlayer,
      title,
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
                  currentSongUri={currentSongUri}
                  deviceId={deviceId}
                  isPlaying={isPlaying}
                  onChangeIsPlaying={this.onChangeIsPlaying}
                  spotifyPlayer={spotifyPlayer}
                />
              )}
            </Box>
          </Box>
          <Box display="grid" gap="16px">
            <Box display="grid" gap="8px">
              <Input
                background={theme.lightgray}
                label="TITLE"
                onChange={this.onChangeTitle}
                value={title}
              />
              <Input
                background={theme.lightgray}
                label="ARTIST"
                onChange={this.onChangeArtist}
                value={artist}
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <IconButton
                bg={theme.blue}
                Icon={LiaMicrophoneSolid}
                justifySelf="end"
                label="SPEAK TO GUESS"
              />
              <Async deferFn={this.handleSubmitGuess}>
                {({ isPending, run }) => (
                  <IconButton
                    bg={theme.blue}
                    disabled={isPending}
                    label="SUBMIT"
                    justifySelf="end"
                    onClick={run}
                  />
                )}
              </Async>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}
