import random
import string
from typing import Dict
from app.schemas.game import GameRoom, Player
import uuid

class GameService:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}

    def generate_room_code(self) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    def generate_color(self) -> str:
            return f"#{random.randint(0, 0xFFFFFF):06x}"

    def create_player(self, name: str, spotify_token: str, is_host: bool = False) -> Player:
        return Player(
            name=name,
            spotify_token=spotify_token,
            is_host=is_host,
            avatar=self.generate_color(),
            id=str(uuid.uuid4())  # Explicitly generate the ID here
        )

    def create_room(self, host_name: str, spotify_token: str) -> GameRoom:
        room_code = self.generate_room_code()
        host = self.create_player(name=host_name, spotify_token=spotify_token, is_host=True)
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

        new_player = self.create_player(name=player_name, spotify_token=spotify_token)
        room.players.append(new_player)
        return room

    def get_room(self, room_code: str) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError(f"Room with code {room_code} not found")
        return self.rooms[room_code]

game_service = GameService()