import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";
import socketService from "../../services/socket";

import GameStatus from "./GameStatus";

export default class GameView extends React.PureComponent {
  componentDidMount() {
    const { roomCode } = this.props;

    socketService.emit("initialize_game", { roomCode });
    socketService.on("game_state_update", this.handleGameStateUpdate);
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);
  }

  handleGameStateUpdate = (data) => {
    const { game_state } = data;

    console.log("Received game state:", game_state);
  };

  render() {
    const { players, roomCode } = this.props;

    return (
      <>
        <Header>
          <GameStatus roomCode={roomCode} />
        </Header>
        <Box display="grid" gridTemplateRows="1fr auto">
          <Players data={players} />
          <IconButton
            bg={theme.blue}
            Icon={LiaArrowRightSolid}
            justifySelf="end"
            label="SPEAK TO GUESS"
          />
        </Box>
      </>
    );
  }
}
