import { Root, Content } from "@radix-ui/react-tabs";
import { branch } from "baobab-react/higher-order";
import { Component } from "react";
import { Async } from "react-async";

import Box from "../../components/Box";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Text from "../../components/Text";
import state from "../../state";
import { withRouter } from "../../utils/withRouter";

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

  onGameError = (error) => this.setState({ error: error.message });

  onGameSuccess = (gameRoom, isHost = false) => {
    const playerData = isHost
      ? gameRoom.host
      : gameRoom.players[gameRoom.players.length - 1];

    const currentPlayerData = {
      name: playerData.name,
      spotify_token: localStorage.getItem("spotify_access_token"),
      is_host: isHost,
      id: playerData.id, // This is the unique ID generated by the backend
      avatar: playerData.avatar,
    };

    state.select("games", "currentRoom").set({
      host: gameRoom.host,
      players: gameRoom.players,
      roomCode: gameRoom.roomCode,
      status: "waiting",
    });

    state.select("user", "player").set(currentPlayerData);

    this.props.navigate(`/game/${gameRoom.roomCode}`);
  };

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
        <Box display="grid" justifyItems="center" gap="32px">
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
                    onGameError={this.onGameError}
                    onGameSuccess={this.onGameSuccess}
                    playerName={playerName}
                    roomCode={roomCode}
                  />
                </Content>
                <Content value="create">
                  <CreateForm
                    onChangePlayerName={this.onChangePlayerName}
                    onGameError={this.onGameError}
                    onGameSuccess={this.onGameSuccess}
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

export default withRouter(branch({ user: ["user"] }, Lobby));
