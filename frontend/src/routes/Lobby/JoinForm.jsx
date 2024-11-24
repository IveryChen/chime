import React from "react";

import Input from "../../components/Input";
import Text from "../../components/Text";

export default class JoinForm extends React.PureComponent {
  render() {
    const { onChangePlayerName, onChangeRoomCode, playerName, roomCode } =
      this.props;

    return (
      <form>
        <Input
          placeholder="Enter your name"
          value={playerName}
          onChange={onChangePlayerName}
        />
        <Input
          placeholder="Enter room code"
          value={roomCode}
          onChange={onChangeRoomCode}
          toUpperCase
        />
        <Text fontFamily="Bebas Neue">Join Game</Text>
      </form>
    );
  }
}
