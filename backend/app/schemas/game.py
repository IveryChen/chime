from pydantic import BaseModel
from typing import List, Optional

class Player(BaseModel):
    name: str
    spotify_token: str
    is_host: bool = False

class GameRoom(BaseModel):
    room_code: str
    host: Player
    players: List[Player]
    status: str = "waiting"  # waiting, playing, finished

class JoinRoomRequest(BaseModel):
    room_code: str
    player_name: str
    spotify_token: str

class CreateRoomRequest(BaseModel):
    host_name: str
    spotify_token: str