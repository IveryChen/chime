import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { Component } from "react";
import { Async } from "react-async";

import handleCreateGame from "../../api/handleCreateGame";
import Box from "../../components/Box";
import Text from "../../components/Text";

import loadUserProfile from "./loadUserProfile";

export default class Lobby extends Component {
  state = {
    showJoinGame: false,
    showCreateGame: false,
    roomCode: "",
    playerName: "",
    error: null,
  };

  onChangeRoomCode = () => {};

  onChangeHideJoinGame = () => this.setState({ showJoinGame: false });

  onChangeShowJoinGame = () => this.setState({ showJoinGame: true });

  onChangeHideCreateGame = () => this.setState({ showCreateGame: false });

  onChangeShowCreateGame = () => this.setState({ showCreateGame: true });

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

    const handleCreateGameClick = async () => {
      const { playerName } = this.state;
      if (!playerName.trim()) {
        throw new Error("Please enter your name");
      }

      const spotifyToken = localStorage.getItem("spotify_access_token");

      if (!spotifyToken) {
        throw new Error("Spotify authentication required");
      }

      return handleCreateGame(playerName, spotifyToken);
    };

    return (
      <>
        <Box display="grid" gridTemplateColumns="1fr auto">
          <Box>
            <Text fontFamily="Oswald" fontSize="20px" lineHeight={1}>
              CASSETTE
            </Text>
            <Text fontSize="18px">盒式磁帶</Text>
          </Box>
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
                <Trigger value="join">
                  <Text
                    fontFamily="Bebas Neue"
                    fontSize="24px"
                    onClick={this.onChangeShowJoinGame}
                    pointer="cursor"
                  >
                    JOIN
                  </Text>
                </Trigger>
                <Trigger value="create">
                  <Text
                    fontFamily="Bebas Neue"
                    fontSize="24px"
                    onClick={this.onChangeShowCreateGame}
                    pointer="cursor"
                  >
                    CREATE
                  </Text>
                </Trigger>
              </Box>
            </List>
            <Content value="join">
              <form onSubmit={this.handleJoinGame}>
                <Box>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={this.state.playerName}
                    onChange={(e) =>
                      this.setState({ playerName: e.target.value })
                    }
                    required
                  />
                </Box>
                <Box>
                  <input
                    type="text"
                    placeholder="Enter room code"
                    value={this.state.roomCode}
                    onChange={(e) =>
                      this.setState({
                        roomCode: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </Box>
                <button type="submit">Join Game</button>
                <button type="button" onClick={this.onChangeHideJoinGame}>
                  Back
                </button>
              </form>
            </Content>
            <Content value="create">
              <Box>
                <Box>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={this.state.playerName}
                    onChange={(e) =>
                      this.setState({ playerName: e.target.value })
                    }
                    required
                  />
                </Box>
                <Async
                  deferFn={handleCreateGameClick}
                  onResolve={this.onCreateGameSuccess}
                  onReject={this.onCreateGameError}
                >
                  {({ isPending, run }) => (
                    <>
                      <button onClick={run} disabled={isPending}>
                        {isPending ? "Creating..." : "Create Game"}
                      </button>
                      <button
                        onClick={this.onChangeHideCreateGame}
                        disabled={isPending}
                      >
                        Back
                      </button>
                    </>
                  )}
                </Async>
              </Box>
            </Content>
          </Root>
        </Box>
      </>
    );
  };
}
