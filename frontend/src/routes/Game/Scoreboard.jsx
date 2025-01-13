import { map } from "lodash";
import React from "react";
import { MdReplay } from "react-icons/md";

import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Text from "../../components/Text";
import { theme } from "../../constants/constants";
import { withRouter } from "../../utils/withRouter";

import GameStatus from "./GameStatus";

class Scoreboard extends React.PureComponent {
  onClick = () => this.props.navigate("/lobby");

  render() {
    const { finalRanking, gameState, roomCode } = this.props;

    if (!gameState) {
      return null;
    }

    const winner = finalRanking[0];

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box
          display="grid"
          gridTemplateRows="auto 1fr auto"
          gap="32px"
          justifyItems="center"
        >
          <Text
            fontSize={32}
            letterSpacing="-2px"
            lineHeight={1}
            textAlign="center"
          >
            SCOREBOARD
          </Text>
          <Box display="grid" gap="32px">
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              key={winner.id}
            >
              <Box
                alt={winner.name}
                bg={winner.avatar}
                borderRadius="50%"
                borderStyle="solid"
                borderWidth={1}
                size={100}
              />
              <Text fontSize="36px" fontStyle="italic" letterSpacing="-2px">
                {winner.name}
              </Text>
              <Text fontSize="24px" fontStyle="italic">
                +{winner.score}
              </Text>
            </Box>
            <Box display="flex" flexWrap="wrap" gap="16px">
              {map(finalRanking, (player, index) => {
                if (index > 0) {
                  return (
                    <Box
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                      key={player.id}
                      transition="opacity 0.2s"
                    >
                      <Box
                        alt={player.name}
                        bg={player.avatar}
                        borderRadius="50%"
                        borderStyle="solid"
                        borderWidth={1}
                        size={42}
                      />
                      <Text fontSize="12px" fontStyle="italic">
                        {player.name}
                      </Text>
                      <Text fontStyle="italic">+{player.score}</Text>
                    </Box>
                  );
                }
              })}
            </Box>
          </Box>
          <IconButton
            bg={theme.blue}
            Icon={MdReplay}
            label="PLAY AGAIN"
            onClick={this.onClick}
          />
        </Box>
      </>
    );
  }
}

export default withRouter(Scoreboard);
