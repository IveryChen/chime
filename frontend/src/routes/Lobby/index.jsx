import { Root, Content } from "@radix-ui/react-tabs";
import { branch } from "baobab-react/higher-order";
import { Component } from "react";
import { Async } from "react-async";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Text from "../../components/Text";

import CreateForm from "./CreateForm";
import JoinForm from "./JoinForm";
import Tabs from "./Tabs";
import loadUserProfile from "./loadUserProfile";

class Lobby extends Component {
  state = {
    roomCode: "",
    tab: "join",
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

  renderBody = ({ error, isPending }) => {
    if (isPending) return <Box>Loading...</Box>;
    if (error) return <Box>Error: {error.message}</Box>;

    const { user } = this.props;
    const { playerName, roomCode, tab } = this.state;

    if (!user) return <Box>No user data found</Box>;

    return (
      <>
        <Header>
          <Logo />
        </Header>
        <Box display="grid" justifyItems="center" gap="64px">
          <Text
            fontSize={40}
            letterSpacing="-2px"
            lineHeight={1}
            textAlign="center"
            width="50%"
          >
            WHAT WOULD YOU LIKE TO DO?
          </Text>
          <Root
            defaultValue="join"
            onValueChange={(tab) => this.setState({ tab })}
          >
            <Box display="grid" gap="24px">
              <Tabs tab={tab} />
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
            </Box>
          </Root>
        </Box>
      </>
    );
  };
}

export default branch({ user: ["user"] }, Lobby);
