import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Animation extends React.PureComponent {
  render() {
    const { name, round, showPlayerName, showRoundText } = this.props;

    return (
      <Box>
        {showRoundText && (
          <Text fontSize="32px" fontWeight="bold" textAlign="center">
            Round {round}
          </Text>
        )}
        {showPlayerName && (
          <Text fontSize="24px" textAlign="center">
            {name}&apos;s Turn
          </Text>
        )}
      </Box>
    );
  }
}
