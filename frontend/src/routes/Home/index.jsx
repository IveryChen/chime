import styled from "@emotion/styled";
import React from "react";
import { FaSpotify } from "react-icons/fa6";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { withRouter } from "../../utils/withRouter";

import { initThreeJS } from "./setUpThreeJS";

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

    > :first-of-type {
      order: 2;
    }

    > :nth-of-type(2) {
      order: 1;
    }
  }
`;

const StyledButton = styled(Box)`
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
  font-size: 48px;
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
  ref = React.createRef();
  threeInstance = null;

  componentDidMount() {
    if (this.ref.current) {
      this.threeInstance = initThreeJS(this.ref.current);
    }
  }

  componentWillUnmount() {
    if (this.threeInstance?.cleanup) {
      this.threeInstance.cleanup();
    }
  }

  onClick = () => this.props.navigate(`/spotify-auth`);

  render() {
    return (
      <StyledBox display="grid" gap="16px">
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
        <Box display="grid" gap="16px">
          <StyledHeading fontWeight="bold" letterSpacing="-2px" lineHeight={1}>
            YOUR GO-TO SPOTIFY MUSIC GAME.
          </StyledHeading>
          <StyledCassette
            as="canvas"
            height={320}
            ref={this.ref}
            width="100%"
          />
          <StyledButton
            bg={theme.blue}
            borderColor="black"
            borderRadius="20px"
            borderStyle="solid"
            borderWidth={2}
            cursor="pointer"
            display="flex"
            gap="8px"
            onClick={this.onClick}
            p="8px"
            userSelect="none"
          >
            <Text fontFamily="Bebas Neue" fontSize="20px" pt="2px">
              I’M READY TO CUE IN
            </Text>
            <Box alignSelf="center" as={FaSpotify} size={24} />
          </StyledButton>
        </Box>
      </StyledBox>
    );
  }
}

export default withRouter(Home);
