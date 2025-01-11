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

    console.log("currentGuess", currentGuess);
    console.log(gameState.currentSong);

    // currentSong has no album images
    return (
      <Box dislay="grid">
        <Box display="grid">
          <Text>ARTIST</Text>
          {/* <Box
            alt={currentSong.artist}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={album.images[0].url}
            size={32}
          /> */}
          {map(currentSong.artists, (artist) => (
            <Text flexShrink={0} fontWeight="medium" fontSize={12} key={artist}>
              {artist}
            </Text>
          ))}
          <Text flexShrink={0} fontWeight="medium" fontSize={12}>
            {currentGuess.artist}
          </Text>
        </Box>
        <Box display="grid">
          <Text>SONG</Text>
          {/* <Box
            alt={currentSong.artist}
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
            src={album.images[0].url}
            size={32}
          /> */}
          <Text flexShrink={0} fontWeight="medium" fontSize={12}>
            {currentSong.name}
          </Text>
          <Text flexShrink={0} fontWeight="medium" fontSize={12}>
            {currentGuess.song}
          </Text>
        </Box>
      </Box>
    );
  }
}
