import { Component } from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class JoinForm extends Component {
  render() {
    const { playerName, roomCode } = this.props;
    return (
      <form>
        <Box>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            // onChange={(e) => this.setState({ playerName: e.target.value })}
            required
          />
        </Box>
        <Box>
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            // onChange={(e) =>
            //   this.setState({
            //     roomCode: e.target.value.toUpperCase(),
            //   })
            // }
            required
          />
        </Box>
        <Text fontFamily="Bebas Neue">Join Game</Text>
      </form>
    );
  }
}
