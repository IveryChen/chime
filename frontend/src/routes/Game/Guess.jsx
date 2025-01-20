import Fuse from "fuse.js";
import React from "react";
import { Async } from "react-async";
import { LiaMicrophoneSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

import socketService from "../../services/socket";

const correctThreshold = 0.7;

const options = {
  threshold: 0.3,
  includeScore: true,
};

export default class Guess extends React.PureComponent {
  state = { artist: "", title: "" };

  onChangeArtist = (artist) => this.setState({ artist });

  onChangeTitle = (title) => this.setState({ title });

  handleSubmitGuess = async () => {
    const { gameState, onChangeAnswer, roomCode } = this.props;
    const { artist, title } = this.state;
    const currentSong = gameState?.currentSong;
    const playerId = gameState?.currentPlayer?.id;

    const artistFuse = new Fuse(currentSong.artists, options);
    const artistResult = artistFuse.search(artist);
    const artistScore = artistResult.length ? 1 - artistResult[0].score : 0;

    const titleFuse = new Fuse([currentSong.title], options);
    const titleResult = titleFuse.search(title);
    const titleScore = titleResult.length ? 1 - titleResult[0].score : 0;

    const isArtistCorrect = artistScore >= correctThreshold;
    const isTitleCorrect = titleScore >= correctThreshold;

    let score = 0;
    if (isArtistCorrect) score += 100;
    if (isTitleCorrect) score += 100;

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
