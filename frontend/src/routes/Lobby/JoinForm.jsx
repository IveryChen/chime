import React from "react";
import { Async } from "react-async";

import handleJoinGame from "../../api/handleJoinGame";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

export default class JoinForm extends React.PureComponent {
  render() {
    const {
      onChangePlayerName,
      onChangeRoomCode,
      onJoinGameError,
      onJoinGameSuccess,
      playerName,
      roomCode,
    } = this.props;

    const handleJoinGameClick = async () => {
      const { playerName, roomCode } = this.props;
      if (!playerName.trim()) {
        throw new Error("Please enter your name");
      }

      const spotifyToken = localStorage.getItem("spotify_access_token");

      if (!spotifyToken) {
        throw new Error("Spotify authentication required");
      }

      return handleJoinGame(playerName, roomCode, spotifyToken);
    };

    return (
      <Box display="grid" gap="32px">
        <Input
          background="#F7FFF9"
          label="ENTER YOUR NAME"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Input
          background="#F7FFF9"
          label="ENTER ROOM CODE"
          value={roomCode}
          onChange={onChangeRoomCode}
          toUpperCase
        />
        <Async
          deferFn={handleJoinGameClick}
          onResolve={onJoinGameSuccess}
          onReject={onJoinGameError}
        >
          {({ isPending, run }) => (
            <IconButton
              bg="#F9E04D"
              disabled={isPending}
              label="JOIN GAME"
              justifySelf="end"
              onClick={run}
            />
          )}
        </Async>
      </Box>
    );
  }
}
