import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import theme from "../../constants/colours";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";

import GameStatus from "./GameStatus";

export default class GameView extends React.PureComponent {
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
            label="START"
          />
        </Box>
      </>
    );
  }
}
