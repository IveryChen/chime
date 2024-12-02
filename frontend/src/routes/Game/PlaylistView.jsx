import { map } from "lodash";
import React from "react";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

export default class Playlist extends React.PureComponent {
  render() {
    const { players, playlists, roomCode } = this.props;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box
          display="grid"
          gap="16px"
          gridTemplateRows="auto 1fr auto"
          py="16px"
        >
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
            fontSize="32px"
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
          <Box display="grid" gap="16px" gridTemplateColumns="1fr 1fr">
            {map(playlists, (data) => {
              if (!data) {
                return;
              }

              const { images, name, owner } = data;

              return (
                <Box>
                  {images && (
                    <Box
                      alt="Profile"
                      as="img"
                      aspectRatio={1}
                      borderStyle="solid"
                      borderWidth={1}
                      src={images[0].url}
                      width="100%"
                    />
                  )}
                  <Text textTransform="uppercase">{name}</Text>
                  <Text fontWeight="regular">{owner.display_name}</Text>
                </Box>
              );
            })}
          </Box>
          <IconButton
            bg={theme.blue}
            justifySelf="end"
            label="DONE"
            onClick={this.onClick}
          />
        </Box>
      </>
    );
  }
}
