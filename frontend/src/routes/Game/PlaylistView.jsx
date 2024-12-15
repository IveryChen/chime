import { includes, map } from "lodash";
import React from "react";
import { Async } from "react-async";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Players from "../../components/Players";
import Playlist from "../../components/Playlist";
import Text from "../../components/Text";
import socketService from "../../services/socket";

export default class PlaylistView extends React.PureComponent {
  state = {
    selectedPlaylists: [],
    status: null,
    submittedPlayers: new Set(),
  };

  componentDidMount() {
    socketService.on(
      "all_playlists_submitted",
      this.handleAllPlaylistsSubmitted
    );
    socketService.on("playlist_submitted", this.handlePlaylistSubmitted);
  }

  componentWillUnmount() {
    socketService.off("playlist_submitted", this.handlePlaylistSubmitted);
    socketService.off(
      "all_playlists_submitted",
      this.handleAllPlaylistsSubmitted
    );
  }

  handlePlaylistSubmitted = ({ player_id, submitted }) => {
    this.setState((prev) => {
      const newSubmittedPlayers = new Set(prev.submittedPlayers);
      if (submitted) {
        newSubmittedPlayers.add(player_id);
      } else {
        newSubmittedPlayers.delete(player_id);
      }
      return {
        submittedPlayers: newSubmittedPlayers,
        status: "waiting",
      };
    });
  };

  handleAllPlaylistsSubmitted = ({ status }) => {
    this.setState({ status }, () => {
      if (status === "success") {
        this.props.onChangeGameStage("game");
      }
    });
  };

  onChangeSelectedPlaylists = (playlistId) => {
    this.setState((prev) => ({
      selectedPlaylists: includes(prev.selectedPlaylists, playlistId)
        ? prev.selectedPlaylists.filter((id) => id !== playlistId)
        : [...prev.selectedPlaylists, playlistId],
    }));
  };

  submitPlaylists = async () => {
    const { playerId, roomCode } = this.props;
    const { selectedPlaylists, submittedPlayers } = this.state;

    socketService.emit("select_playlists", {
      roomCode,
      playerId,
      playlistIds: selectedPlaylists,
    });

    this.setState({
      status: "waiting",
      submittedPlayers: new Set([...submittedPlayers, playerId]),
    });

    return Promise.resolve({ status: "waiting" });
  };

  render() {
    const { players } = this.props;
    const { submittedPlayers } = this.state;

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
          <Players data={players} submittedPlayers={submittedPlayers} />
          <Text
            fontSize={24}
            fontWeight="bold"
            justifySelf="center"
            letterSpacing="-1px"
            lineHeight={1}
          >
            SELECT PLAYLISTS
          </Text>
          <Async deferFn={this.submitPlaylists}>{this.renderBody}</Async>
        </Box>
      </>
    );
  }

  renderBody = ({ isPending, run }) => {
    const { playlists, players, playerId } = this.props;
    const { selectedPlaylists } = this.state;
    const { submittedPlayers, status } = this.state;
    const hasSubmitted = submittedPlayers.has(playerId);

    return (
      <>
        {status === "waiting" && (
          <Text bg={theme.yellow}>
            Waiting for other players... ({submittedPlayers.size} /{" "}
            {players.length} ready)
          </Text>
        )}
        <Box
          display="grid"
          gap="16px"
          gridTemplateColumns="1fr 1fr"
          overflow="auto"
          opacity={hasSubmitted ? 0.5 : 1}
          pointerEvents={hasSubmitted ? "none" : "auto"}
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
          disabled={isPending || hasSubmitted}
          fontSize={16}
          justifySelf="end"
          label="DONE"
          onClick={run}
        />
      </>
    );
  };
}
