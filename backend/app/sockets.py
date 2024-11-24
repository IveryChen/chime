connected_players = {}
room_players = {}

def register_sio_events(sio):
    @sio.event
    async def connect(sid, environ):
        """
        Handles a new client connection.
        
        Parameters:
        - sid (str): The session ID of the connected client.
        - environ (dict): The environment details, useful for inspecting headers, etc.
        """
        print(f"Client connected: {sid}")
        # Optional: You can initialize any connection-specific data here if needed
        connected_players[sid] = {}
        await sio.emit('connect-ack', {'message': 'Connected successfully!'}, to=sid)

    @sio.event
    async def disconnect(sid):
        print(f"Client disconnected: {sid}")
        player = connected_players.get(sid)
        if player:
            room_code = player.get('room_code')
            if room_code and room_code in room_players:
                room_players[room_code] = [
                    p for p in room_players[room_code] 
                    if p.get('socket_id') != sid
                ]
                # Broadcast update
                if room_players[room_code]:
                    await sio.emit(
                        'players-update', 
                        {'players': room_players[room_code]}, 
                        room=room_code
                    )
                else:
                    del room_players[room_code]
        
        if sid in connected_players:
            del connected_players[sid]

    @sio.event
    async def join_room(sid, data):
        room_code = data.get('roomCode')
        player = data.get('player')
        
        if not room_code or not player:
            return
        
        # Add socket info to player
        player['socket_id'] = sid
        
        # Store player info
        connected_players[sid] = {
            **player,
            'room_code': room_code
        }
        
        # Initialize room if needed
        if room_code not in room_players:
            room_players[room_code] = []
        
        # Add player to room if not already in
        if not any(p.get('socket_id') == sid for p in room_players[room_code]):
            room_players[room_code].append(player)
        
        # Join socket.io room
        await sio.enter_room(sid, room_code)
        
        # Broadcast update
        await sio.emit(
            'players-update', 
            {'players': room_players[room_code]}, 
            room=room_code
        )

    @sio.event
    async def leave_room(sid, data):
        room_code = data.get('roomCode')
        if room_code in room_players:
            # Remove player from room
            room_players[room_code] = [
                p for p in room_players[room_code] 
                if p.get('socket_id') != sid
            ]
            
            # Leave socket.io room
            await sio.leave_room(sid, room_code)
            
            # Remove room code from player info
            if sid in connected_players:
                connected_players[sid].pop('room_code', None)
            
            # Broadcast update
            if room_players[room_code]:
                await sio.emit(
                    'players-update', 
                    {'players': room_players[room_code]}, 
                    room=room_code
                )
            else:
                del room_players[room_code]
