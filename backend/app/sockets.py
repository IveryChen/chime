from app.services.game import game_service
from app.schemas.game import Player

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

    @sio.event
    async def join_room(sid, data):
        room_code = data['roomCode']
        player_name = data['player']['name']
        spotify_token = data['player']['spotify_token']
        
        try:
            room = game_service.join_room(room_code, player_name, spotify_token)
            # Update the player's socket_id
            for player in room.players:
                if player.name == player_name:
                    player.socket_id = sid
                    player.id = sid  # Using sid as player id
                    break
            
            await sio.enter_room(sid, room_code)
            await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)
        except ValueError as e:
            await sio.emit('error', {'message': str(e)}, room=sid)

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