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
