from app.services.game import game_service
from app.schemas.game import Player, GameState
from datetime import datetime
import random

def register_sio_events(sio):
    @sio.event
    async def connect(sid, environ):
        print(f"Client connected: {sid}")

    @sio.event
    async def disconnect(sid):
        print(f"Client disconnected: {sid}")
        # Find the room and player associated with this sid
        for room_code, room in game_service.rooms.items():
            for player in room.players:
                if player.socket_id == sid:
                    room.players.remove(player)
                    await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)
                    break

    async def join_room_handler(sid, data):
        try:
            room_code = data['roomCode']
            player = data['player']

            room = game_service.join_room(room_code, player['name'], player['spotify_token'])
            print("Room joined successfully")

            for p in room.players:
                if p.name == player['name']:
                    p.socket_id = sid
                    break

            await sio.enter_room(sid, room_code)
            await sio.emit('players-update',
                {'players': [p.dict() for p in room.players]},
                room=room_code
            )

        except ValueError as e:
            print(f"Game error: {str(e)}")
            await sio.emit('error', {'message': str(e)}, room=sid)

    sio.on('join-room', join_room_handler)

    @sio.event
    async def leave_room(sid, data):
        room_code = data['roomCode']
        if room_code in game_service.rooms:
            room = game_service.rooms[room_code]
            room.players = [p for p in room.players if p.socket_id != sid]
            await sio.leave_room(sid, room_code)
            await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)
            if len(room.players) == 0:
                del game_service.rooms[room_code]

    @sio.event
    async def select_playlists(sid, data):
        room_code = data['roomCode']
        player_id = data['playerId']
        playlist_ids = data['playlistIds']

        room = game_service.get_room(room_code)

        for player in room.players:
            print(f"Player {player.id}: selected_playlists = {player.selected_playlists}")

            if player.id == player_id:
                player.selected_playlists = playlist_ids

                await sio.emit('playlist_submitted', {
                    'player_id': player_id,
                    'submitted': True
                }, room=room_code)
                break

        all_selected = all(player.selected_playlists for player in room.players)
        print(f"Room status before check: {room.status}")

        if all_selected:
            room.status = "playing"
            print(f"Room status after check: {room.status}")
            # Emit that everyone has submitted and game can start
            await sio.emit('all_playlists_submitted', {
                'status': 'success'
            }, room=room_code)

        # Broadcast updated player status to all players in the room
        await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)

    @sio.event
    async def initialize_game(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)

            if not room.game_state:
                random.shuffle(room.players)
                current_player = room.players[0]

                room.game_state = GameState(
                    current_round=1,
                    scores={p.id: 0 for p in room.players},
                    current_player=current_player,
                    round_state={},
                    timestamp=datetime.now()
                )

            game_state_dict = room.game_state.dict()
            game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()

            await sio.emit('game_state_update', {
                'game_state': game_state_dict
            }, room=room_code)

        except Exception as e:
            print(f"Error in initialize_game: {str(e)}")
            import traceback
            traceback.print_exc()