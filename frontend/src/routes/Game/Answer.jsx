import { map } from "lodash";
import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Answer extends React.PureComponent {
  render() {
    const { currentGuess, gameState } = this.props;

    if (!gameState) {
      return null;
    }

    const currentSong = gameState.currentSong;

    return (
      <Box alignContent="space-evenly" display="grid" justifyItems="center">
        <Box display="grid" gap="8px" justifyItems="center">
          <Text fontSize="24px">ARTIST</Text>
          <Box
            alt={currentSong.artist}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={currentSong.artistImage}
            size={180}
          />
          {map(currentSong.artists, (artist) => (
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
            color={currentGuess.isArtistCorrect ? "green" : "red"}
            flexShrink={0}
            fontFamily="Bebas Neue"
            fontSize={24}
            fontWeight="bold"
            textTransform="uppercase"
          >
            {currentGuess.artist}
          </Text>
        </Box>
        <Box display="grid" gap="8px" justifyItems="center">
          <Text fontSize="24px">TITLE</Text>
          <Box
            alt={currentSong.title}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={currentSong.albumImage}
            size={180}
          />
          <Text
            flexShrink={0}
            fontWeight="bold"
            fontSize={12}
            textTransform="uppercase"
          >
            {currentSong.title}
          </Text>
          <Text
            color={currentGuess.isTitleCorrect ? "green" : "red"}
            flexShrink={0}
            fontWeight="bold"
            fontFamily="Bebas Neue"
            fontSize={24}
            textTransform="uppercase"
          >
            {currentGuess.title}
          </Text>
        </Box>
      </Box>
    );
  }
}
