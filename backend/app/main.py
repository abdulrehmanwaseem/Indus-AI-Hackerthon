"""
Tandarust AI — FastAPI Backend
──────────────────────────────
Main application entry point.
Run with: uvicorn app.main:app --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, patients, prescriptions, dashboard

# ── Logging ───────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ─────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(f"🚀 {settings.APP_NAME} backend starting...")
    logger.info(f"   Supabase URL : {settings.SUPABASE_URL}")
    logger.info(f"   CORS origin  : {settings.FRONTEND_URL}")
    logger.info(f"   Debug mode   : {settings.DEBUG}")
    yield
    logger.info("👋 Shutting down...")


# ── App ───────────────────────────────────────────────
app = FastAPI(
    title="Tandarust AI API",
    description=(
        "AI-powered healthcare backend for patient prioritization, "
        "prescription digitization, and health risk prediction."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ── CORS Middleware ───────────────────────────────────
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers ───────────────────────────────────────────
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(prescriptions.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


# ── Health Check ──────────────────────────────────────
@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "Tandarust AI API", "version": "1.0.0"}


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Tandarust AI API",
        "docs": "/docs",
        "health": "/api/health",
    }
