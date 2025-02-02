import styled from "@emotion/styled";
import React from "react";

import cassette_temp from "../../assets/cassette_temp.png";
import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Text from "../../components/Text";
import { withRouter } from "../../utils/withRouter";

import { initThreeJS } from "./setUpThreeJS";
import { arrow, cursor } from "./constants";

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

const StyledSmallBox = styled(Box)`
  display: grid;
  grid-template-rows: auto 1fr;

  @media (min-width: 768px) {
    > :first-child {
      order: 2;
    }

    > :nth-child(2) {
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

const StyledButtonGroup = styled(Box)`
  align-items: start;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: start;
    grid-template-columns: auto 1fr;
  }
`;

const StyledCursor = styled(Box)`
  margin-left: 160px;

  @media (min-width: 768px) {
    margin-left: 0px;
  }
`;

const StyledCassette = styled(Box)`
  height: 320px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    height: auto;
    max-width: 800px;
    width: 90%;
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

  onClick = () => this.props.navigate("/lobby");

  render() {
    return (
      <StyledBox display="grid" gap="16px">
        <StyledBar
          bg={theme.lightgray}
          borderColor="black"
          borderRadius="12px"
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
          <StyledHeading
            fontWeight="bold"
            letterSpacing="-2px"
            lineHeight={1}
            position="relative"
            width="100%"
          >
            YOUR&nbsp;
            <span>GO‑TO </span>SPOTIFY MUSIC GAME.
            <Box
              alt="Profile"
              as="img"
              position="absolute"
              size={120}
              src={arrow}
            />
          </StyledHeading>
          <StyledSmallBox>
            <StyledCassette as="img" src={cassette_temp} size="100%" />
            <StyledButtonGroup>
              <StyledButton
                bg={theme.blue}
                borderColor="black"
                borderRadius="20px"
                borderStyle="solid"
                borderWidth={2}
                cursor="pointer"
                display="flex"
                onClick={this.onClick}
                px="12px"
                py="6px"
                userSelect="none"
              >
                <Text fontFamily="Bebas Neue" fontSize="20px" pt="2px">
                  I'M READY TO CUE IN
                </Text>
              </StyledButton>
              <StyledCursor alt="Profile" as="img" size={120} src={cursor} />
            </StyledButtonGroup>
          </StyledSmallBox>
        </Box>
      </StyledBox>
    );
  }
}

export default withRouter(Home);
