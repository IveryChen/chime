import React from "react";
import { Async } from "react-async";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

import handleJoinGame from "./handleJoinGame";

export default class JoinForm extends React.PureComponent {
  render() {
    const {
      onChangePlayerName,
      onChangeRoomCode,
      onGameError,
      onGameSuccess,
      playerName,
      roomCode,
    } = this.props;

    const handleJoinGameClick = async () => {
      const { playerName, roomCode } = this.props;
      if (!playerName.trim()) {
        throw new Error("Please enter your name");
      }

      return handleJoinGame(playerName, roomCode);
    };

    return (
      <Box display="grid" gap="32px">
        <Input
          background={theme.lightgray}
          label="ENTER YOUR NAME"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Input
          background={theme.lightgray}
          label="ENTER ROOM CODE"
          value={roomCode}
          onChange={onChangeRoomCode}
          toUpperCase
        />
        <Async
          deferFn={handleJoinGameClick}
          onResolve={(gameRoom) => onGameSuccess(gameRoom, false)}
          onReject={onGameError}
        >
          {({ isPending, run }) => (
            <IconButton
              bg={theme.yellow}
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
