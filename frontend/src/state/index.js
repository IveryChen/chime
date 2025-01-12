import Baobab from "baobab";

export default new Baobab({
  user: { player: null },
  games: {
    currentRoom: {
      host: null,
      gameState: {
        currentPlayer: null,
        currentRound: null,
        lastGuess: {},
        roundState: {},
        scores: {},
        timestamp: null,
      },
      players: null,
      roomCode: null,
      status: null,
    },
  },
});
