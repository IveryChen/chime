import { map } from "lodash";
import React from "react";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

import handleSubmitSelection from "./handleSubmitSelection";

export default class Playlist extends React.PureComponent {
  state = {
    selectedPlaylists: [],
  };

  onChangeSelectedPlaylists = (playlistId) => {
    this.setState((prevState) => ({
      selectedPlaylists: [...prevState.selectedPlaylists, playlistId],
    }));
  };

  handleSubmit = () => {
    const { roomCode, playerId } = this.props;
    const { selectedPlaylists } = this.state;

    return handleSubmitSelection({ roomCode, playerId, selectedPlaylists });
  };

  render() {
    const { players, playlists } = this.props;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box
          display="grid"
          gap="16px"
          gridTemplateRows="auto 1fr auto"
          overflow="hidden"
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
                    size={36}
                  />
                )}
                <Text fontSize="12px">{player.name}</Text>
              </Box>
            ))}
          </Box>
          <Text
            fontSize={24}
            fontWeight="bold"
            justifySelf="center"
            letterSpacing="-1px"
            lineHeight={1}
          >
            SELECT PLAYLISTS
          </Text>
          <Box
            display="grid"
            gap="16px"
            gridTemplateColumns="1fr 1fr"
            overflow="auto"
          >
            {map(playlists, (data) => {
              if (!data) {
                return;
              }

              const { images, name, owner } = data;

              return (
                <Box key={name}>
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
                  <Text fontSize={12} lineHeight={1} textTransform="uppercase">
                    {name}
                  </Text>
                  <Text fontSize={10} fontWeight="regular" lineHeight={1}>
                    {owner.display_name}
                  </Text>
                </Box>
              );
            })}
          </Box>
          <IconButton
            bg={theme.blue}
            fontSize={16}
            justifySelf="end"
            label="DONE"
            onClick={this.handleSubmit}
          />
        </Box>
      </>
    );
  }
}
