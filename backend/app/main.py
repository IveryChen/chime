from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import auth, game
from app.config import settings
import sys
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Chime Game API",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application...")
    logger.info(f"CORS Origins: {settings.allowed_origins}")
    logger.info(f"Frontend URL: {settings.FRONTEND_URL}")
    logger.info(f"API URL: {settings.API_URL}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"]
)

@app.get("/debug")
async def debug_settings():
    """Endpoint to verify current settings"""
    return {
        "settings": {
            "FRONTEND_URL": settings.FRONTEND_URL,
            "API_URL": settings.API_URL,
            "SPOTIFY_REDIRECT_URI": settings.SPOTIFY_REDIRECT_URI,
            "CORS_ORIGIN": settings.CORS_ORIGIN,
            "has_spotify_credentials": bool(settings.SPOTIFY_CLIENT_ID and settings.SPOTIFY_CLIENT_SECRET),
            "environment": "production" if settings.is_production else "development",
            "allowed_origins": settings.allowed_origins  # Add this to debug output
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(game.router, prefix="/api/game", tags=["game"])

@app.get("/")
async def root():
    return {
        "message": "Chime API is running",
        "environment": {
            "frontend_url": settings.FRONTEND_URL,
            "api_url": settings.API_URL,
            "is_production": settings.is_production,
            "allowed_origins": settings.allowed_origins
        }
    }

@app.get("/test-api-login")
async def test_api_login(request: Request):
    url = f"{settings.API_URL}/api/auth/login"  # Use settings.API_URL
    response = await request.get(url)
    return {
        "status_code": response.status_code,
        "content": await response.text()
    }

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