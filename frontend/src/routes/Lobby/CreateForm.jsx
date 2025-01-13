import React from "react";
import { Async } from "react-async";
import { FaSpotify } from "react-icons/fa6";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";
import { withRouter } from "../../utils/withRouter";

import handleCreateGame from "./handleCreateGame";

class CreateForm extends React.PureComponent {
  onClick = () => this.props.navigate("/spotify-auth");

  handleCreateGameClick = async () => {
    const { playerName } = this.props;
    if (!playerName.trim()) {
      throw new Error("Please enter your name");
    }

    const spotifyToken = localStorage.getItem("spotify_access_token");

    return handleCreateGame(playerName, spotifyToken);
  };

  render() {
    const { onChangePlayerName, onGameError, onGameSuccess, playerName } =
      this.props;
    const hasSpotifyToken = Boolean(
      localStorage.getItem("spotify_access_token")
    );

    if (!hasSpotifyToken) {
      return (
        <Box display="grid" justifyItems="center">
          <IconButton
            bg={theme.blue}
            Icon={FaSpotify}
            label="SIGN IN TO SPOTIFY"
            onClick={this.onClick}
          />
        </Box>
      );
    }

    return (
      <Box display="grid" gap="32px">
        <Input
          background={theme.lightgray}
          label="ENTER YOUR NAME"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Async
          deferFn={this.handleCreateGameClick}
          onResolve={(gameRoom) => onGameSuccess(gameRoom, true)}
          onReject={onGameError}
        >
          {({ isPending, run }) => (
            <IconButton
              bg={theme.yellow}
              disabled={isPending}
              justifySelf="end"
              label="CREATE GAME"
              onClick={run}
            />
          )}
        </Async>
      </Box>
    );
  }
}

export default withRouter(CreateForm);
