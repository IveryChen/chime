import random
import string
from typing import Dict
from app.schemas.game import GameRoom, Player

class GameService:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}

    def generate_room_code(self) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    def create_room(self, host_name: str, spotify_token: str) -> GameRoom:
        room_code = self.generate_room_code()
        host = Player(name=host_name, spotify_token=spotify_token, is_host=True)
        room = GameRoom(
            room_code=room_code,
            host=host,
            players=[host]
        )
        self.rooms[room_code] = room
        return room

    def join_room(self, room_code: str, player_name: str, spotify_token: str) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError("Room not found")
        
        room = self.rooms[room_code]
        if room.status != "waiting":
            raise ValueError("Game already in progress")

        new_player = Player(name=player_name, spotify_token=spotify_token)
        room.players.append(new_player)
        return room

game_service = GameService()