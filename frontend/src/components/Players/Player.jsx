import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Player extends React.PureComponent {
  render() {
    const { size, opacity, player } = this.props;
    const { avatar, id, name } = player;

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        key={id}
        opacity={opacity}
        transition="opacity 0.2s"
      >
        {avatar && (
          <Box
            alt={name}
            bg={avatar}
            borderRadius="50%"
            borderStyle="solid"
            borderWidth={1}
            size={size}
          />
        )}
        <Text fontSize="12px" fontStyle="italic">
          {name}
        </Text>
      </Box>
    );
  }
}
