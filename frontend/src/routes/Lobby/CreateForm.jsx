import React from "react";
import { Async } from "react-async";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

import handleCreateGame from "./handleCreateGame";

export default class CreateForm extends React.PureComponent {
  render() {
    const {
      onChangePlayerName,
      onCreateGameError,
      onCreateGameSuccess,
      playerName,
    } = this.props;

    const handleCreateGameClick = async () => {
      const { playerName } = this.props;
      if (!playerName.trim()) {
        throw new Error("Please enter your name");
      }

      const spotifyToken = localStorage.getItem("spotify_access_token");

      if (!spotifyToken) {
        throw new Error("Spotify authentication required");
      }

      return handleCreateGame(playerName, spotifyToken);
    };

    return (
      <Box display="grid" gap="32px">
        <Input
          background="#F7FFF9"
          label="ENTER YOUR NAME"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Async
          deferFn={handleCreateGameClick}
          onResolve={onCreateGameSuccess}
          onReject={onCreateGameError}
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
