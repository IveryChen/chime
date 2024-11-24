import React from "react";
import { Async } from "react-async";

import handleCreateGame from "../../api/handleCreateGame";
import Box from "../../components/Box";
import Input from "../../components/Input";
import Text from "../../components/Text";

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
      <Box>
        <Input
          label="Enter your name"
          placeholder="Enter your name"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Async
          deferFn={handleCreateGameClick}
          onResolve={onCreateGameSuccess}
          onReject={onCreateGameError}
        >
          {({ isPending, run }) => (
            <Text fontFamily="Bebas Neue" onClick={run} disabled={isPending}>
              {isPending ? "Creating..." : "Create Game"}
            </Text>
          )}
        </Async>
      </Box>
    );
  }
}
