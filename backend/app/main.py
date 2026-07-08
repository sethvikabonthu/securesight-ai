from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import scans

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="VeriShield AI Synthetic Media & Phishing Detection Engine REST API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    scans.router,
    prefix="/scan",
    tags=["Detection Scanners"]
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }