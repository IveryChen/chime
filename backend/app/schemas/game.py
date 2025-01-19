from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class Player(BaseModel):
    name: str
    spotify_token: Optional[str] = None
    is_host: bool = False
    socket_id: Optional[str] = None
    id: Optional[str] = None
    avatar: Optional[str] = None
    selected_playlists: Optional[List[str]] = None

class GameState(BaseModel):
    current_round: int
    scores: Dict[str, int]  # player_id -> score
    current_player: Player
    current_song: Optional[Dict] = None
    round_state: dict
    show_answer: bool = False
    is_game_over: bool = False
    timestamp: datetime

class GameRoom(BaseModel):
    room_code: str
    host: Player
    players: List[Player]
    status: str = "waiting"  # waiting, loading_songs, playing, finished
    game_state: Optional[GameState] = None
    selected_songs: Optional[List[Dict]] = None

# perhaps this should be player_id
class JoinRoomRequest(BaseModel):
    room_code: str
    player_name: str
    spotify_token: Optional[str] = None

class PlaylistSelectionRequest(BaseModel):
    player_id: str
    selected_playlists: List[str]

class CreateRoomRequest(BaseModel):
    host_name: str = Field(alias="hostName")
    spotify_token: str = Field(alias="spotifyToken")

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.strftime('%Y-%m-%d %H:%M:%S')
        }
