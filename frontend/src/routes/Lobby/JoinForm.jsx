import { Component } from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class JoinForm extends Component {
  render() {
    const { onChangePlayerName, onChangeRoomCode, playerName, roomCode } =
      this.props;

    return (
      <form>
        <Box>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => onChangePlayerName(e.target.value)}
            required
          />
        </Box>
        <Box>
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => onChangeRoomCode(e.target.value.toUpperCase())}
            required
          />
        </Box>
        <Text fontFamily="Bebas Neue">Join Game</Text>
      </form>
    );
  }
}
