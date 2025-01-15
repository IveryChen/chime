import Baobab from "baobab";

export default new Baobab({
  user: { player: null },
  games: {
    currentRoom: {
      host: null,
      players: null,
      roomCode: null,
      status: null,
    },
    gameState: {
      currentPlayer: null,
      currentRound: null,
      // currentSong: null, TODO: what happened to currentSong
      lastGuess: {},
      roundState: {},
      scores: {},
      timestamp: null,
    },
  },
});
