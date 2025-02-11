import { Root, Content } from "@radix-ui/react-tabs";
import { branch } from "baobab-react/higher-order";
import { Component } from "react";

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
    error: null,
    isLoadingProfile: false,
    playerName: "",
    roomCode: "",
    tab: "join",
  };

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("roomCode");

    if (roomCode) {
      this.setState({
        roomCode,
        tab: "join",
      });
    }

    const hasSpotifyToken = Boolean(
      localStorage.getItem("spotify_access_token")
    );
    if (hasSpotifyToken) {
      this.loadUserProfile();
    }
  }

  loadUserProfile = async () => {
    this.setState({ isLoadingProfile: true });
    try {
      await loadUserProfile();
      const params = new URLSearchParams(window.location.search);
      const roomCode = params.get("roomCode");
      if (!roomCode) {
        this.setState({ tab: "create" });
      }
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoadingProfile: false });
    }
  };

  onChangeRoomCode = (roomCode) => this.setState({ roomCode });

  onChangePlayerName = (playerName) => this.setState({ playerName });

  onGameError = (error) => this.setState({ error: error.message });

  onGameSuccess = (gameRoom, isHost = false) => {
    if (!gameRoom || !gameRoom.players) {
      console.error("Invalid game room data:", gameRoom);
      return;
    }

    const playerData = isHost
      ? gameRoom.host
      : gameRoom.players.length > 0
      ? gameRoom.players[gameRoom.players.length - 1]
      : null;

    if (!playerData) {
      console.error("No player data found");
      return;
    }

    const currentPlayerData = {
      name: playerData.name,
      spotify_token: localStorage.getItem("spotify_access_token"),
      is_host: isHost,
      id: playerData.id,
      avatar: playerData.avatar,
    };

    state.select("games", "currentRoom").set({
      host: gameRoom.host,
      players: gameRoom.players,
      roomCode: gameRoom.roomCode,
      status: "waiting",
    });

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
    const { isLoadingProfile, playerName, roomCode, tab } = this.state;

    if (isLoadingProfile) return <Box>Loading profile...</Box>;

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
            value={tab}
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
  }
}

export default withRouter(branch({ user: ["user"] }, Lobby));
