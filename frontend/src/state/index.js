import Baobab from "baobab";

export default new Baobab({
  user: null,
  game: {
    currentRoom: null,
    players: [],
    rooms: {},
    state: null,
  },
});
