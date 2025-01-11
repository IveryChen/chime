import React from "react";
import { Async } from "react-async";
import { LiaMicrophoneSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

import socketService from "../../services/socket";

export default class Guess extends React.PureComponent {
  state = { artist: "", song: "" };

  onChangeArtist = (artist) => this.setState({ artist });

  onChangeSong = (song) => this.setState({ song });

  handleSubmitGuess = async () => {
    const { gameState, onChangeAnswer, onChangeCurrentGuess, roomCode } =
      this.props;
    const { artist, song } = this.state;
    const currentSong = gameState?.currentSong;
    const playerId = gameState?.currentPlayer?.id;

    const normalize = (str) => str.toLowerCase().trim();
    const isArtistCorrect = currentSong.artists.some(
      (artistName) => normalize(artistName) === normalize(artist)
    );
    const isSongCorrect = normalize(currentSong.name) === normalize(song);

    let score = 0;
    if (isArtistCorrect) score += 1;
    if (isSongCorrect) score += 1;

    const guess = {
      artist,
      song,
      isArtistCorrect,
      isSongCorrect,
    };

    socketService.emit("submit_score", {
      roomCode,
      playerId,
      score: score,
      guess,
    });

    onChangeAnswer(true);
    onChangeCurrentGuess(guess);

    this.setState({
      artist: "",
      song: "",
      submitStatus: {
        artist: isArtistCorrect,
        song: isSongCorrect,
      },
    });
  };

  render() {
    const { gameState } = this.props;
    const { artist, song } = this.state;

    if (!gameState) {
      return null;
    }

    return (
      <Box display="grid" gap="16px">
        <Box display="grid" gap="8px">
          <Input
            background={theme.lightgray}
            label="SONG"
            onChange={this.onChangeSong}
            value={song}
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
    );
  }
}
