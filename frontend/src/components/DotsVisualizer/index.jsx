import React from "react";
import { fill, map } from "lodash";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";

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
          <Box
            key={i}
            bg={theme.blue}
            borderRadius="50%"
            height="8px"
            transition="transform 0.2s ease"
            width="8px"
            style={{
              transform: `scale(${scale})`,
            }}
          />
        ))}
      </Box>
    );
  }
}
