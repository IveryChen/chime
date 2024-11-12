from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import auth, game
from app.config import settings

app = FastAPI(
    title="Chime Game API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        settings.CORS_ORIGIN
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/api/debug")
async def debug_settings():
    """Endpoint to verify current settings"""
    return {
        "settings": {
            "FRONTEND_URL": settings.FRONTEND_URL,
            "API_URL": settings.API_URL,
            "SPOTIFY_REDIRECT_URI": settings.SPOTIFY_REDIRECT_URI,
            "CORS_ORIGIN": settings.CORS_ORIGIN,
            "has_spotify_credentials": bool(settings.SPOTIFY_CLIENT_ID and settings.SPOTIFY_CLIENT_SECRET)
        }
    }

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Not Found",
            "path": request.url.path,
            "method": request.method
        }
    )

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(game.router, prefix="/api/game", tags=["game"])

@app.get("/")
async def root():
    return {
        "message": "Chime API is running",
        "environment": {
            "frontend_url": settings.FRONTEND_URL,
            "api_url": settings.API_URL
        }
    }