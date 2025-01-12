import React from "react";
import { Async } from "react-async";
import { LiaMicrophoneSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

import socketService from "../../services/socket";

export default class Guess extends React.PureComponent {
  state = { artist: "", title: "" };

  onChangeArtist = (artist) => this.setState({ artist });

  onChangeTitle = (title) => this.setState({ title });

  handleSubmitGuess = async () => {
    const { gameState, onChangeAnswer, roomCode } = this.props;
    const { artist, title } = this.state;
    const currentSong = gameState?.currentSong;
    const playerId = gameState?.currentPlayer?.id;

    const normalize = (str) => str.toLowerCase().trim();
    const isArtistCorrect = currentSong.artists.some(
      (artistName) => normalize(artistName) === normalize(artist)
    );
    const isTitleCorrect = normalize(currentSong.title) === normalize(title);

    let score = 0;
    if (isArtistCorrect) score += 1;
    if (isTitleCorrect) score += 1;

    const guess = {
      artist,
      title,
      isArtistCorrect,
      isTitleCorrect,
    };

    socketService.emit("submit_score", {
      roomCode,
      playerId,
      score,
      guess,
    });

    onChangeAnswer(true);

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
    const { gameState } = this.props;
    const { artist, title } = this.state;

    if (!gameState) {
      return null;
    }

    return (
      <Box
        bg="white"
        borderRadius="24px"
        borderStyle="solid"
        borderWidth={1}
        display="grid"
        gap="16px"
        p="16px"
      >
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
    );
  }
}
