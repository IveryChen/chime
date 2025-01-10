from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from app.routes import auth, game
from app.config import settings
from app.sockets import register_sio_events

app = FastAPI(
    title="Cassette",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(game.router, prefix="/api/game", tags=["game"])

# Debug endpoint
@app.get("/debug/env")
async def debug_environment():
    return {
        "environment": settings.ENVIRONMENT,
        "is_production": settings.is_production,
        "frontend_url": settings.FRONTEND_URL,
        "api_url": settings.API_URL,
        "cors_origin": settings.CORS_ORIGIN,
        "spotify_redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "allowed_origins": settings.allowed_origins
    }

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.allowed_origins,
    logger=True,
)

register_sio_events(sio)

socket_app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=app,
    socketio_path='sockets'
)

# app = socket_app