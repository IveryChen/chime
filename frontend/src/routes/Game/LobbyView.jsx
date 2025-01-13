import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

class LobbyView extends React.PureComponent {
  onClick = () => this.props.onChangeGameStage("playlist");

  render() {
    const { currentRoom, roomCode, user } = this.props;
    const { players } = currentRoom;

    return (
      <>
        <Header>
          <Logo />
        </Header>
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
                alignItems="center"
                display="flex"
                flexDirection="column"
                key={player.id}
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
          {user.player.is_host && (
            <IconButton
              bg={theme.blue}
              Icon={LiaArrowRightSolid}
              justifySelf="end"
              label="START"
              onClick={this.onClick}
            />
          )}
        </Box>
      </>
    );
  }
}

export default branch(
  {
    currentRoom: ["games", "currentRoom"],
    user: ["user"],
  },
  LobbyView
);
