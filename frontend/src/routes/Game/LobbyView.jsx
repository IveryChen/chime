import { map } from "lodash";
import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Text from "../../components/Text";

export default class LobbyView extends React.PureComponent {
  onClick = () => this.props.onChangeGameStage("playlist");

  render() {
    const { players, roomCode } = this.props;

    return (
      <Box display="grid" gridTemplateRows="auto 1fr auto">
        <Text
          fontSize="42px"
          fontStyle="italic"
          fontWeight="bold"
          justifySelf="center"
        >
          {roomCode}
        </Text>
        <Box display="flex" gap="16px" flexWrap="wrap">
          {map(players, (player) => (
            <Box
              key={player.id}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {player.avatar && (
                <Box
                  alt={player.name}
                  bg={player.avatar}
                  borderRadius="50%"
                  borderStyle="solid"
                  borderWidth={1}
                  size={64}
                />
              )}
              <Text fontSize="20px">{player.name}</Text>
              {player.is_host && <Text fontSize="16px">(Host)</Text>}
            </Box>
          ))}
        </Box>
        <IconButton
          bg={theme.blue}
          Icon={LiaArrowRightSolid}
          justifySelf="end"
          label="START"
          onClick={this.onClick}
        />
      </Box>
    );
  }
}
