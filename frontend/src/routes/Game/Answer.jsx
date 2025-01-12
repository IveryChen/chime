import { map } from "lodash";
import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

const underline = "_____________";

export default class Answer extends React.PureComponent {
  render() {
    const { gameState } = this.props;

    if (!gameState) {
      return null;
    }

    const { currentSong, lastGuess } = gameState;

    if (!lastGuess) {
      return <Text>loading guesses...</Text>;
    }

    const { guess } = lastGuess;
    const { albumImage, artists, artistImage, title } = currentSong;
    const {
      artist: guessArtist,
      isArtistCorrect,
      isTitleCorrect,
      title: guessTitle,
    } = guess;

    return (
      <Box alignContent="space-evenly" display="grid" justifyItems="center">
        <Box display="grid" gap="8px" justifyItems="center">
          <Text fontSize="24px">ARTIST</Text>
          <Box
            alt={artists[0]}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={artistImage}
            size={180}
          />
          {map(artists, (artist) => (
            <Text
              flexShrink={0}
              fontWeight="bold"
              fontSize={12}
              key={artist}
              textTransform="uppercase"
            >
              {artist}
            </Text>
          ))}
          <Text
            color={isArtistCorrect ? "green" : "red"}
            flexShrink={0}
            fontFamily="Bebas Neue"
            fontSize={24}
            fontWeight="bold"
            textTransform="uppercase"
          >
            {guessArtist || underline}
          </Text>
        </Box>
        <Box display="grid" gap="8px" justifyItems="center">
          <Text fontSize="24px">TITLE</Text>
          <Box
            alt={title}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={albumImage}
            size={180}
          />
          <Text
            flexShrink={0}
            fontWeight="bold"
            fontSize={12}
            textTransform="uppercase"
          >
            {title}
          </Text>
          <Text
            color={isTitleCorrect ? "green" : "red"}
            flexShrink={0}
            fontWeight="bold"
            fontFamily="Bebas Neue"
            fontSize={24}
            textTransform="uppercase"
          >
            {guessTitle || underline}
          </Text>
        </Box>
      </Box>
    );
  }
}
