import { includes, map } from "lodash";
import React from "react";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Players from "../../components/Players";
import Playlist from "../../components/Playlist";
import Text from "../../components/Text";

import handleSubmitSelection from "./handleSubmitSelection";

export default class PlaylistView extends React.PureComponent {
  state = {
    selectedPlaylists: [],
  };

  onChangeSelectedPlaylists = (playlistId) => {
    this.setState((prevState) => ({
      selectedPlaylists: includes(prevState.selectedPlaylists, playlistId)
        ? prevState.selectedPlaylists.filter((id) => id !== playlistId)
        : [...prevState.selectedPlaylists, playlistId],
    }));
  };

  handleSubmit = () => {
    const { playerId, roomCode } = this.props;
    const { selectedPlaylists } = this.state;

    const status = handleSubmitSelection({
      playerId,
      roomCode,
      selectedPlaylists,
    });

    console.log(status);

    this.props.onChangeGameStage("game");
  };

  render() {
    const { players, playlists } = this.props;
    const { selectedPlaylists } = this.state;

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
          <Players data={players} />
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
            {map(playlists, (data, index) => {
              if (!data) {
                return;
              }

              return (
                <Playlist
                  data={data}
                  key={index}
                  onChangeSelectedPlaylists={this.onChangeSelectedPlaylists}
                  selectedPlaylists={selectedPlaylists}
                />
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
