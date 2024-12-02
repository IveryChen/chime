from fastapi import APIRouter, HTTPException
from app.schemas.game import CreateRoomRequest, JoinRoomRequest, GameRoom, PlaylistSelectionRequest
from app.services.game import game_service
from typing import Dict

router = APIRouter()

@router.post("/create-room")
async def create_room(request: CreateRoomRequest) -> GameRoom:
    try:
        room = game_service.create_room(
            host_name=request.host_name,
            spotify_token=request.spotify_token
        )
        return room
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join-room")
async def join_room(request: JoinRoomRequest) -> GameRoom:
    try:
        room = game_service.join_room(
            room_code=request.room_code,
            player_name=request.player_name,
            spotify_token=request.spotify_token
        )
        return room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/select-playlists/{room_code}")
async def select_playlists(room_code: str, request: PlaylistSelectionRequest) -> Dict[str, str]:
    player_id = request.player_id
    selected_playlists = request.selected_playlists

    room = game_service.get_room(room_code)

    for player in room.players:
        if player.id == player_id:
            player.selected_playlists = selected_playlists
            break
    # Check if all players have selected playlists
    all_selected = all(player.selected_playlists for player in room.players)
    if all_selected:
        room.status = "playing"
    return {"status": "success"}