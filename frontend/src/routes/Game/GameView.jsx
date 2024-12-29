import React from "react";
import { LiaArrowRightSolid } from "react-icons/lia";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Players from "../../components/Players";
import socketService from "../../services/socket";

import GameStatus from "./GameStatus";
import initializeSpotifySDK from "./initializeSpotifySDK";
import playSnippet from "./playSnippet";

export default class GameView extends React.PureComponent {
  state = { deviceId: null, gameState: null, spotifyPlayer: null };

  onChangeDeviceId = (deviceId) => this.setState({ deviceId });

  onChangeSpotifyPlayer = (spotifyPlayer) => this.setState({ spotifyPlayer });

  componentDidMount() {
    const { roomCode } = this.props;

    socketService.emit("initialize_game", { roomCode });
    socketService.on("game_state_update", this.handleGameStateUpdate);

    initializeSpotifySDK(this.onChangeDeviceId, this.onChangeSpotifyPlayer);
  }

  componentWillUnmount() {
    socketService.off("game_state_update", this.handleGameStateUpdate);

    if (this.state.spotifyPlayer) {
      this.state.spotifyPlayer.disconnect();
    }
  }

  handleGameStateUpdate = (data) => {
    const { gameState } = data;
    this.setState({ gameState });
  };

  render() {
    const { players, roomCode } = this.props;
    const { deviceId, gameState, spotifyPlayer } = this.state;

    return (
      <>
        <Header>
          <GameStatus gameState={gameState} roomCode={roomCode} />
        </Header>
        <Box display="grid" gridTemplateRows="1fr auto">
          <Players data={players} />
          <IconButton
            bg={theme.blue}
            Icon={LiaArrowRightSolid}
            justifySelf="end"
            label="SPEAK TO GUESS"
            onClick={() => playSnippet(deviceId, spotifyPlayer)}
          />
        </Box>
      </>
    );
  }
}
