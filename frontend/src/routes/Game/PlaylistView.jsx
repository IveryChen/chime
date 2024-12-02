import { map } from "lodash";
import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

export default class Playlist extends React.PureComponent {
  render() {
    const { players, roomCode } = this.props;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box display="grid" gridTemplateRows="auto 1fr auto">
          <Box
            display="grid"
            gap="16px"
            gridTemplateColumns="repeat(auto-fill, minmax(1fr))"
          >
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
                    size={42}
                  />
                )}
                <Text fontSize="12px">{player.name}</Text>
              </Box>
            ))}
          </Box>
          <Text
            fontSize="36px"
            fontWeight="bold"
            justifySelf="center"
            letterSpacing="-1px"
          >
            SELECT PLAYLISTS
            <Text
              fontSize="24px"
              fontWeight="bold"
              justifySelf="center"
              lineHeight={1}
            >
              {roomCode}
            </Text>
          </Text>
          <IconButton
            bg={theme.blue}
            Icon={LiaArrowRightSolid}
            justifySelf="end"
            label="START"
            onClick={this.onClick}
          />
        </Box>
      </>
    );
  }
}
