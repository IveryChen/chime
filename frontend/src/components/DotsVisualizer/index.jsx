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
        gap="16px"
        gridTemplateColumns="repeat(4, 1fr)"
        height="100px"
        justifyContent="center"
        justifyItems="center"
        margin="0 auto"
        opacity={isPlaying ? 1 : 0}
        padding="16px"
        width="fit-content"
      >
        {map(scales, (scale, i) => (
          <Dot
            bg={theme.blue}
            borderRadius="50%"
            key={i}
            scale={scale}
            transition="transform 0.2s ease"
            size={32}
          />
        ))}
      </Box>
    );
  }
}
