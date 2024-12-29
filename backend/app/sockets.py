from app.services.game import game_service
from app.schemas.game import Player, GameState
from datetime import datetime
import random

def to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def convert_to_camel_case(obj):
    if isinstance(obj, dict):
        return {to_camel_case(k): convert_to_camel_case(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_camel_case(item) for item in obj]
    return obj

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

            try:
                # Select songs for the game when all playlists are submitted
                selected_songs = await game_service.select_songs_for_game(room_code)
                print(f"Selected {len(selected_songs)} songs for the game")

                await sio.emit('all_playlists_submitted', {
                    'status': 'success',
                    'selectedSongs': selected_songs
                }, room=room_code)
            except ValueError as e:
                print(f"Error selecting songs: {str(e)}")
                await sio.emit('error', {
                    'message': f"Error selecting songs: {str(e)}"
                }, room=room_code)
                return

        # Broadcast updated player status to all players in the room
        await sio.emit('players-update', {
            'players': [p.dict() for p in room.players],
            'status': room.status
        }, room=room_code)

    @sio.event
    async def initialize_game(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)

            if not room.game_state:
                random.shuffle(room.players)
                current_player = room.players[0]

                first_song = random.choice(room.selected_songs) if room.selected_songs else None

                room.game_state = GameState(
                    current_round=1,
                    scores={p.id: 0 for p in room.players},
                    current_player=current_player,
                    current_song=first_song,
                    round_state={},
                    timestamp=datetime.now()
                )

            game_state_dict = room.game_state.dict()
            game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()

            camel_case_game_state = convert_to_camel_case(game_state_dict)

            await sio.emit('game_state_update', {
                'gameState': camel_case_game_state
            }, room=room_code)

        except Exception as e:
            print(f"Error in initialize_game: {str(e)}")

    @sio.event
    async def start_new_round(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)

            if not room.game_state:
                raise ValueError("Game not initialized")

            # Get next player
            current_player_index = room.players.index(room.game_state.current_player)
            next_player_index = (current_player_index + 1) % len(room.players)
            next_player = room.players[next_player_index]

            # Get a new random song that hasn't been used yet
            used_song_ids = {
                song['id'] for song in room.game_state.round_state.get('used_songs', [])
            }
            available_songs = [
                song for song in room.selected_songs
                if song['id'] not in used_song_ids
            ]

            if not available_songs:
                # Game is over - no more songs
                room.status = "finished"
                await sio.emit('game_over', {
                    'scores': room.game_state.scores
                }, room=room_code)
                return

            next_song = random.choice(available_songs)

            # Update game state
            room.game_state.current_round += 1
            room.game_state.current_player = next_player
            room.game_state.current_song = next_song
            room.game_state.timestamp = datetime.now()

            # Track used songs
            if 'used_songs' not in room.game_state.round_state:
                room.game_state.round_state['used_songs'] = []
            room.game_state.round_state['used_songs'].append(next_song)

            game_state_dict = room.game_state.dict()
            game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()
            camel_case_game_state = convert_to_camel_case(game_state_dict)

            await sio.emit('game_state_update', {
                'gameState': camel_case_game_state
            }, room=room_code)

        except Exception as e:
            print(f"Error starting new round: {str(e)}")
            await sio.emit('error', {'message': str(e)}, room=room_code)