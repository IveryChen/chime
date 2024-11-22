import styled from "@emotion/styled";
import { Component } from "react";
import { FaSpotify } from "react-icons/fa6";

import Box from "../../components/Box";
import Text from "../../components/Text";

const StyledBar = styled(Box)`
  align-items: center;
  height: 56px;
  width: 100%;

  @media (min-width: 768px) {
    align-items: start;
    height: 100%;
    width: 56px;
  }
`;

const StyledBox = styled(Box)`
  grid-template-row: auto 1fr;

  @media (min-width: 768px) {
    grid-template-columns: auto 1fr;
    height: 100%;

    > :first-child {
      order: 2;
    }

    > :nth-child(2) {
      order: 1;
    }
  }
`;

const StyledText = styled(Text)`
  transform: rotate(0 deg);

  @media (min-width: 768px) {
    transform: rotate(90deg);
  }
`;

export default class Home extends Component {
  onClick = () => (window.location.href = "/spotify-auth");

  render() {
    return (
      <StyledBox display="grid">
        <StyledBar
          bg="#F7FFF9"
          borderColor="black"
          borderRadius="16px"
          borderStyle="solid"
          borderWidth={2}
          display="flex"
          justifyContent="space-between"
          p="16px"
        >
          <StyledText fontFamily="Oswald" fontSize="24px">
            CASSETTE
          </StyledText>
        </StyledBar>
        <Box display="grid" gap="24px" height="100%">
          <Text
            fontWeight="bold"
            fontSize="120px"
            lineHeight={1}
            textAlign="start"
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
      </StyledBox>
    );
  }
}
