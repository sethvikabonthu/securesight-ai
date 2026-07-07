from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import scans, history, reports

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="VeriShield AI Synthetic Media & Phishing Detection Engine REST API"
)

# CORS middleware rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(scans.router, prefix="/scan", tags=["Detection Scanners"])
app.include_router(history.router, prefix="", tags=["Audit Log Ledger"])
app.include_router(reports.router, prefix="/reports", tags=["Threat Audits"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }
