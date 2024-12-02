from fastapi import APIRouter, HTTPException
from app.schemas.game import CreateRoomRequest, JoinRoomRequest, GameRoom
from app.services.game import game_service
from typing import List

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

@router.get("/room/{room_code}")
async def get_room(room_code: str) -> GameRoom:
    if room_code not in game_service.rooms:
        raise HTTPException(status_code=404, detail="Room not found")
    return game_service.rooms[room_code]

@router.post("/select-playlists/{room_code}")
async def select_playlists(room_code: str, player_id: str, playlist_ids: List[str]):
    room = game_service.get_room(room_code)
    for player in room.players:
        if player.id == player_id:
            player.selected_playlists = playlist_ids
            break
    # Check if all players have selected playlists
    all_selected = all(player.selected_playlists for player in room.players)
    if all_selected:
        room.status = "playing"
    return {"status": "success"}