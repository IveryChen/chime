import { includes } from "lodash";
import React from "react";
import { Async } from "react-async";
import { MdCheck } from "react-icons/md";

import fetchPlaylistTracks from "../../api/fetchPlaylistTracks";
import Box from "../../components/Box";

import PlaylistTitle from "./PlaylistTitle";

export default class Playlist extends React.PureComponent {
  onClick = () => this.props.onChangeSelectedPlaylists(this.props.data.id);

  render() {
    const { data, selectedPlaylists } = this.props;
    const { id, images } = data;
    const isSelected = includes(selectedPlaylists, id);

    return (
      <Box>
        {images && (
          <Box onClick={this.onClick} position="relative">
            <Box
              alt="Profile"
              as="img"
              aspectRatio={1}
              borderStyle="solid"
              borderWidth={1}
              src={images[0].url}
              width="100%"
            />
            {isSelected && (
              <Box
                alignContent="center"
                bg="white"
                borderRadius="50%"
                borderStyle="solid"
                borderWidth={1}
                display="grid"
                justifyContent="center"
                p={0}
                position="absolute"
                right={2}
                size={24}
                top={2}
              >
                <Box as={MdCheck} size={16} />
              </Box>
            )}
          </Box>
        )}
        <Async
          deferFn={fetchPlaylistTracks}
          playlistId={id}
          spotifyToken={localStorage.getItem("spotify_access_token")}
        >
          {this.renderBody}
        </Async>
      </Box>
    );
  }

  renderBody = ({ isPending, data: tracksData, run }) => {
    const { data, onChangePlaylistTracks, playlistTracks } = this.props;
    console.log("tracksData", tracksData);

    return (
      <PlaylistTitle
        data={data}
        disabled={isPending}
        onChangePlaylistTracks={onChangePlaylistTracks}
        playlistTracks={playlistTracks}
        run={run}
      />
    );
  };
}
