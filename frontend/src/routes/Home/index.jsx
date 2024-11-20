import { Component } from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Home extends Component {
  onClick = () => (window.location.href = "/spotify-auth");

  render() {
    return (
      <Box display="grid" gap="32px" padding="32px">
        <Text
          fontWeight="bold"
          fontSize="120px"
          lineHeight={1}
          letterSpacing="-2px"
          width="60%"
        >
          YOUR GO-TO SPOTIFY MUSIC GAME.
        </Text>
        <Text
          bg="#4CABFF"
          borderColor="black"
          borderRadius="20px"
          borderStyle="solid"
          borderWidth={2}
          fontFamily="Bebas Neue"
          fontSize="20px"
          justifySelf="start"
          onClick={this.onClick}
          p="8px"
        >
          I’M READY TO CUE IN
        </Text>
      </Box>
    );
  }
}
