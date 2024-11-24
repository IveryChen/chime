import React from "react";

import Box from "../../components/Box";
import Input from "../../components/Input";
import Text from "../../components/Text";

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
        <Text fontFamily="Bebas Neue">Join Game</Text>
      </Box>
    );
  }
}
