from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from spotipy.oauth2 import SpotifyOAuth
from app.config import settings

router = APIRouter()

@router.get("/login")
async def login():
    try:
        auth_manager = SpotifyOAuth(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET,
            redirect_uri=settings.SPOTIFY_REDIRECT_URI,
            scope=" ".join([
                "streaming",
                "user-read-email",
                "user-read-private",
                "user-library-read",
                "playlist-read-private",
                "user-top-read",
                "user-read-playback-state",
                "user-modify-playback-state",
                "app-remote-control"
            ])
        )

        auth_url = auth_manager.get_authorize_url()
        return {"url": auth_url}
    except Exception as e:
        print("Auth error:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/callback")
async def callback(code: str):
    try:
        auth_manager = SpotifyOAuth(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET,
            redirect_uri=settings.SPOTIFY_REDIRECT_URI
        )

        token_info = auth_manager.get_access_token(code)

        redirect_url = f"{settings.FRONTEND_URL}/spotify-auth?access_token={token_info['access_token']}"

        return RedirectResponse(
            url=redirect_url,
            status_code=302
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))