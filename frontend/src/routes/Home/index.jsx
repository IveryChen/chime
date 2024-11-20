import { Component } from "react";
import { FaSpotify } from "react-icons/fa6";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Home extends Component {
  onClick = () => (window.location.href = "/spotify-auth");

  render() {
    return (
      <Box height="100%">
        <Box display="grid" gridTemplateColumns="auto 1fr" height="100%">
          <Box display="grid" gap="24px">
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
              alignSelf="start"
              bg="#4CABFF"
              borderColor="black"
              borderRadius="20px"
              borderStyle="solid"
              borderWidth={2}
              cursor="pointer"
              display="flex"
              fontFamily="Bebas Neue"
              fontSize="20px"
              gap="8px"
              justifySelf="start"
              onClick={this.onClick}
              p="8px"
              userSelect="none"
            >
              I’M READY TO CUE IN
              <Box alignSelf="center" as={FaSpotify} size={24} />
            </Text>
          </Box>
          <Box
            borderColor="black"
            borderRadius="20px"
            borderStyle="solid"
            borderWidth={2}
            display="flex"
            justifyContent="space-between"
            bg="#F7FFF9"
            width="64px"
            height="100%"
          >
            <Text>CASSETTE</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
