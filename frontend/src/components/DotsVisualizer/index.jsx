import styled from "@emotion/styled";
import React from "react";
import { fill, map } from "lodash";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";

const Dot = styled(Box)`
  transform: ${(props) => `scale(${props.scale})`};
`;

export default class DotsVisualizer extends React.PureComponent {
  state = {
    scales: fill(Array(16), 1),
  };

  interval = null;

  componentDidMount() {
    this.startAnimation();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isPlaying !== this.props.isPlaying) {
      if (this.props.isPlaying) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  startAnimation = () => {
    this.interval = setInterval(() => {
      this.setState({
        scales: map(fill(Array(16)), () => 0.5 + Math.random()),
      });
    }, 100);
  };

  stopAnimation = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.setState({ scales: fill(Array(16), 1) });
    }
  };

  render() {
    const { isPlaying } = this.props;
    const { scales } = this.state;

    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap="8px"
        justifyContent="center"
        justifyItems="center"
        width="fit-content"
        margin="0 auto"
        padding="16px"
      >
        {map(scales, (scale, i) => (
          <Dot
            bg={theme.blue}
            borderRadius="50%"
            height="8px"
            key={i}
            opacity={isPlaying ? 1 : 0}
            scale={scale}
            transition="transform 0.2s ease"
            width="8px"
          />
        ))}
      </Box>
    );
  }
}
