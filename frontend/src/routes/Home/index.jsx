import styled from "@emotion/styled";
import React from "react";
import { FaSpotify } from "react-icons/fa6";

import cassette_temp from "../../assets/cassette_temp.png";
import theme from "../../constants/colours";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { withRouter } from "../../utils/withRouter";

const StyledBar = styled(Box)`
  align-items: center;
  height: 56px;
  width: 100%;

  @media (min-width: 768px) {
    align-items: start;
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
    width: 56px;
  }
`;

const StyledBox = styled(Box)`
  grid-template-row: auto 1fr;

  @media (min-width: 768px) {
    grid-template-columns: auto 1fr;
    height: 100%;

    > :first-of-type {
      order: 2;
    }

    > :nth-of-type(2) {
      order: 1;
    }
  }
`;

const StyledButton = styled(Text)`
  justify-self: center;

  @media (min-width: 768px) {
    justify-self: start;
  }
`;

const StyledCassette = styled(Box)`
  width: 100%;

  @media (min-width: 768px) {
    justify-content: center;
    width: 50%;
  }
`;

const StyledHeading = styled(Text)`
  font-size: 64px;
  width: 80%;

  @media (min-width: 768px) {
    font-size: 120px;
    width: 70%;
  }
`;

const StyledText = styled(Text)`
  transform: rotate(0 deg);

  @media (min-width: 768px) {
    transform: rotate(90deg);
  }
`;

const StyledTextChinese = styled(Text)`
  transform: rotate(0 deg);

  @media (min-width: 768px) {
    transform: rotate(0 deg);
  }
`;

class Home extends React.PureComponent {
  onClick = () => this.props.navigate(`/spotify-auth`);

  render() {
    return (
      <StyledBox display="grid" gap="32px">
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
          <StyledTextChinese fontFamily="Oswald" fontSize="24px">
            盒式磁帶
          </StyledTextChinese>
        </StyledBar>
        <Box display="grid" gap="32px" height="100%">
          <StyledHeading fontWeight="bold" letterSpacing="-2px" lineHeight={1}>
            YOUR GO-TO SPOTIFY MUSIC GAME.
          </StyledHeading>
          <StyledCassette as="img" src={cassette_temp} size="100%" />
          <StyledButton
            alignSelf="start"
            bg={theme.blue}
            borderColor="black"
            borderRadius="20px"
            borderStyle="solid"
            borderWidth={2}
            cursor="pointer"
            display="flex"
            fontFamily="Bebas Neue"
            fontSize="20px"
            gap="8px"
            onClick={this.onClick}
            p="8px"
            userSelect="none"
          >
            I’M READY TO CUE IN
            <Box alignSelf="center" as={FaSpotify} size={24} />
          </StyledButton>
        </Box>
      </StyledBox>
    );
  }
}

export default withRouter(Home);
