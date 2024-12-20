import { map } from "lodash";
import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Players extends React.PureComponent {
  render() {
    const { data, submittedPlayers = new Set() } = this.props;

    return (
      <Box
        display="grid"
        gap="16px"
        gridTemplateColumns="repeat(auto-fill, minmax(1fr))"
      >
        {map(data, (player) => (
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            key={player.id}
            opacity={submittedPlayers.has(player.id) ? 1 : 0.5}
            transition="opacity 0.2s"
          >
            {player.avatar && (
              <Box
                alt={player.name}
                bg={player.avatar}
                borderRadius="50%"
                borderStyle="solid"
                borderWidth={1}
                size={36}
              />
            )}
            <Text fontSize="12px">{player.name}</Text>
          </Box>
        ))}
      </Box>
    );
  }
}
