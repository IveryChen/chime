import React from "react";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";

export default class DotsVisualizer extends React.PureComponent {
  state = {
    scales: Array(16).fill(1),
  };

  interval = null;

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
        scales: Array(16)
          .fill()
          .map(() => 0.5 + Math.random()),
      });
    }, 100);
  };

  stopAnimation = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.setState({ scales: Array(16).fill(1) });
    }
  };

  render() {
    const { scales } = this.state;

    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)" // 4x4 grid
        gap="8px"
        justifyContent="center"
        justifyItems="center"
        width="fit-content"
        margin="0 auto"
        padding="16px"
      >
        {scales.map((scale, i) => (
          <Box
            key={i}
            bg={theme.blue}
            borderRadius="50%"
            height="8px"
            width="8px"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 100ms ease",
            }}
          />
        ))}
      </Box>
    );
  }
}
