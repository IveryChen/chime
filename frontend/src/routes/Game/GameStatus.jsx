import { Component } from "react";

import Box from "../../components/Box";
import Status from "../../components/Status";
import Text from "../../components/Text";

export default class GameStatus extends Component {
  render() {
    const { roomCode } = this.props;

    return (
      <Box cursor="pointer">
        <Text fontFamily="Oswald" fontSize={16} lineHeight={1}>
          {roomCode}
        </Text>
        <Status />
      </Box>
    );
  }
}
