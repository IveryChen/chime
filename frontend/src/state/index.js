import Baobab from "baobab";

export default new Baobab({
  user: null,
  games: {
    rooms: {},
    /*
      rooms: {
        'ABC123': {  // room_code
          room_code: 'ABC123',
          host: {
            name: 'John',
            spotify_token: '...',
            is_host: true,
            socket_id: '...',
            id: '...',
            avatar: '...'
          },
          players: [
            {
              name: 'John',
              spotify_token: '...',
              is_host: true,
              socket_id: '...',
              id: '...',
              avatar: '...'
            },
            {
              name: 'Jane',
              spotify_token: '...',
              is_host: false,
              socket_id: '...',
              id: '...',
              avatar: '...'
            }
          ],
          status: 'waiting'  // waiting, playing, finished
          gameState: {
            currentRound: 1, 
            scores: {},
            currentPlayer: 'player-id',
          },
        },
        'XYZ789': {
          // another room...
        }
      }
    */
    currentRoom: null,
  },
});
