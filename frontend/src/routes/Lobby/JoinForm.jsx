import React from "react";

import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

export default class JoinForm extends React.PureComponent {
  render() {
    const { onChangePlayerName, onChangeRoomCode, playerName, roomCode } =
      this.props;

    return (
      <Box display="grid" gap="16px">
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
        <IconButton bg="#F9E04D" label="JOIN GAME" justifySelf="end" />
      </Box>
    );
  }
}
