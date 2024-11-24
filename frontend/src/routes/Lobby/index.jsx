import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { Component } from "react";
import { Async } from "react-async";

import Box from "../../components/Box";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

import CreateForm from "./CreateForm";
import JoinForm from "./JoinForm";
import loadUserProfile from "./loadUserProfile";

export default class Lobby extends Component {
  state = {
    roomCode: "",
    playerName: "",
    error: null,
  };

  onChangeRoomCode = (roomCode) => this.setState({ roomCode });

  onChangePlayerName = (playerName) => this.setState({ playerName });

  onCreateGameError = (error) => this.setState({ error: error.message });

  onCreateGameSuccess = (gameData) =>
    (window.location.href = `/game/${gameData.roomCode}`);

  render() {
    return <Async promiseFn={loadUserProfile}>{this.renderBody}</Async>;
  }

  renderBody = ({ data: user, error, isPending }) => {
    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>No user data found</div>;

    const { playerName, roomCode } = this.state;

    return (
      <>
        <Box display="grid" gridTemplateColumns="1fr auto">
          <Logo />
          {user.images?.[0]?.url && (
            <Box
              alt="Profile"
              as="img"
              borderRadius="50%"
              borderStyle="solid"
              borderWidth={1}
              size={48}
              src={user.images[0].url}
            />
          )}
        </Box>
        <Box display="grid" justifyItems="center">
          <Text
            textAlign="center"
            fontSize={40}
            letterSpacing="-2px"
            lineHeight={1}
            width="50%"
          >
            WHAT WOULD YOU LIKE TO DO?
          </Text>
          <Root defaultValue="join">
            <List>
              <Box display="flex" gap="24px" justifyContent="center">
                <Trigger
                  style={{ backgroundColor: "transparent" }}
                  value="join"
                >
                  <Text
                    fontFamily="Bebas Neue"
                    fontSize="24px"
                    pointer="cursor"
                  >
                    JOIN
                  </Text>
                </Trigger>
                <Trigger
                  style={{ backgroundColor: "transparent" }}
                  value="create"
                >
                  <Text
                    fontFamily="Bebas Neue"
                    fontSize="24px"
                    pointer="cursor"
                  >
                    CREATE
                  </Text>
                </Trigger>
              </Box>
            </List>
            <Box
              bg="white"
              borderRadius="24px"
              borderStyle="solid"
              borderWidth={1}
              p="16px"
            >
              <Content value="join">
                <JoinForm
                  onChangePlayerName={this.onChangePlayerName}
                  onChangeRoomCode={this.onChangeRoomCode}
                  playerName={playerName}
                  roomCode={roomCode}
                />
              </Content>
              <Content value="create">
                <CreateForm
                  onChangePlayerName={this.onChangePlayerName}
                  onCreateGameError={this.onCreateGameError}
                  onCreateGameSuccess={this.onCreateGameSuccess}
                  playerName={playerName}
                />
              </Content>
            </Box>
          </Root>
        </Box>
      </>
    );
  };
}
