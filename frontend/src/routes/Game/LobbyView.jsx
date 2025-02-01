import { branch } from "baobab-react/higher-order";
import { map } from "lodash";
import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";
import { RiShareLine } from "react-icons/ri";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import Tip from "../../components/Tip";

class LobbyView extends React.PureComponent {
  state = {
    isPending: false,
    tooltipText: "Copy game link",
  };

  onClick = () => this.props.onUpdateGameStage("selecting_playlist");

  handleShare = async () => {
    const url = `${window.location.origin}/lobby?roomCode=${this.props.roomCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Link to join my Cassette game!",
          url: url,
        });
        return;
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }

    navigator.clipboard.writeText(url);

    this.setState({ isPending: true, tooltipText: "Copied!" });

    setTimeout(() => {
      this.setState({ isPending: false, tooltipText: "Copy game link" });
    }, 200);
  };

  render() {
    const { currentRoom, roomCode, user } = this.props;
    const { players } = currentRoom;
    const { isPending, tooltipText } = this.state;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box display="grid" gridTemplateRows="auto 1fr auto">
          <Box
            alignItems="center"
            display="flex"
            gap="4px"
            justifyContent="center"
          >
            <Text
              lineHeight={1}
              fontSize="42px"
              fontStyle="italic"
              fontWeight="bold"
              justifySelf="center"
            >
              {roomCode}
            </Text>
            <Tip tooltipText={tooltipText}>
              <Box
                as={RiShareLine}
                cursor="pointer"
                onClick={this.handleShare}
                opacity={isPending ? 0.5 : 1}
                size={36}
              />
            </Tip>
          </Box>
          <Box display="flex" gap="16px" flexWrap="wrap">
            {map(players, (player) => (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                key={player.id}
              >
                {player.avatar && (
                  <Box
                    alt={player.name}
                    bg={player.avatar}
                    borderRadius="50%"
                    borderStyle="solid"
                    borderWidth={1}
                    size={64}
                  />
                )}
                <Text fontSize="20px">{player.name}</Text>
                {player.is_host && <Text fontSize="16px">(Host)</Text>}
              </Box>
            ))}
          </Box>
          {user.player.is_host && (
            <IconButton
              bg={theme.blue}
              Icon={LiaArrowRightSolid}
              justifySelf="end"
              label="START"
              onClick={this.onClick}
            />
          )}
        </Box>
      </>
    );
  }
}

export default branch(
  {
    currentRoom: ["games", "currentRoom"],
    user: ["user"],
  },
  LobbyView
);
