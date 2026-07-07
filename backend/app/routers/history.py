from fastapi import APIRouter
from typing import List
from app.routers.scans import db_scan_history
from app.schemas.scan import ScanResponse, DashboardStatsResponse, RecentActivity, ThreatTrendItem, ScanTypeDistItem, RiskDistItem

router = APIRouter()

# Populate default mock items if db is completely empty
def ensure_default_data():
    if not db_scan_history:
        # Default mock scans
        db_scan_history.extend([
            ScanResponse(
                id="scan-1001",
                fileName="ceo_voice_clone.mp3",
                fileSize="2.4 MB",
                scanType="audio",
                status="danger",
                confidence=96.8,
                riskLevel="Critical",
                detectedIssues=[
                    "Frequency spectrum anomalies at 4.2kHz",
                    "Artificial silence patterns between phrases",
                    "Lack of natural breath sounds",
                    "Phase incoherence characteristic of voice conversion models"
                ],
                explanation="The audio sample exhibits significant synthetic artifacts typical of neural voice cloning algorithms. There is a 96.8% probability that this audio is synthetically generated.",
                recommendedActions=[
                    "Do not authorize any financial transactions requested in this audio.",
                    "Verify the speaker identity via a secondary, pre-established channel.",
                    "Report the incident to the internal security response team."
                ],
                metadata={"duration": "45s", "format": "audio/mp3"},
                timestamp="2026-07-07T14:32:00Z"
            ),
            ScanResponse(
                id="scan-1002",
                fileName="executive_headshot_update.png",
                fileSize="5.1 MB",
                scanType="image",
                status="safe",
                confidence=12.4,
                riskLevel="Low",
                detectedIssues=[],
                explanation="No synthetic media signatures detected. Image noise distributions and lighting vectors are consistent with natural photographic captures.",
                recommendedActions=["No immediate actions required. File appears authentic."],
                metadata={"resolution": "3840x2160", "format": "image/png"},
                timestamp="2026-07-07T12:15:00Z"
            ),
            ScanResponse(
                id="scan-1003",
                scanType="url",
                status="danger",
                confidence=98.2,
                riskLevel="High",
                detectedIssues=[
                    "Domain age: Registered less than 24 hours ago",
                    "SSL Certificate: Free Let's Encrypt with mismatching SANs",
                    "Suspicious TLD (.xyz)",
                    "Homoglyph attack: Uses lookalike Cyrillic characters"
                ],
                explanation="The URL matches characteristics of a credential harvesting landing page designed to mimic financial services.",
                recommendedActions=[
                    "Do not click or enter credentials on this URL.",
                    "Block the domain at the company DNS/firewall level.",
                    "Notify team members of potential spear-phishing campaigns."
                ],
                metadata={"url": "https://secure-login-paypal.xyz", "ipAddress": "198.51.100.42"},
                timestamp="2026-07-07T10:04:00Z"
            )
        ])

@router.get("/history", response_model=List[ScanResponse])
async def get_history():
    ensure_default_data()
    return db_scan_history

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats():
    ensure_default_data()
    
    total = len(db_scan_history)
    threats = len([h for h in db_scan_history if h.status != "safe"])
    safe = total - threats
    
    deepfakes = len([h for h in db_scan_history if h.scanType in ["image", "video", "audio"] and h.status != "safe"])
    phishing = threats - deepfakes

    recent = []
    for h in db_scan_history[:5]:
        target = h.fileName or h.metadata.get("url") or f"{h.scanType.upper()} scan text"
        recent.append(
            RecentActivity(
                id=h.id,
                action=f"Scanned {h.scanType.upper()}",
                target=str(target),
                status="flagged" if h.status != "safe" else "safe",
                timestamp=h.timestamp
            )
        )

    # Compute scan distribution
    types_count = {}
    for h in db_scan_history:
        types_count[h.scanType] = types_count.get(h.scanType, 0) + 1

    dist_colors = {
        "image": "#3B82F6",
        "video": "#EF4444",
        "audio": "#10B981",
        "url": "#F59E0B",
        "email": "#8B5CF6",
        "sms": "#EC4899"
    }

    dist_list = []
    for k, v in types_count.items():
        dist_list.append(
            ScanTypeDistItem(
                name=f"{k.capitalize()}s",
                value=v,
                color=dist_colors.get(k, "#6B7280")
            )
        )

    # Risk levels count
    risks_count = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for h in db_scan_history:
        risks_count[h.riskLevel] = risks_count.get(h.riskLevel, 0) + 1

    risk_list = [
        RiskDistItem(name="Low Risk", count=risks_count["Low"]),
        RiskDistItem(name="Medium Risk", count=risks_count["Medium"]),
        RiskDistItem(name="High Risk", count=risks_count["High"]),
        RiskDistItem(name="Critical Risk", count=risks_count["Critical"])
    ]

    # Threat Trend mock timeline
    trend = [
        ThreatTrendItem(date="Jul 01", safe=4, threats=1),
        ThreatTrendItem(date="Jul 02", safe=6, threats=2),
        ThreatTrendItem(date="Jul 03", safe=5, threats=3),
        ThreatTrendItem(date="Jul 04", safe=8, threats=1),
        ThreatTrendItem(date="Jul 05", safe=11, threats=4),
        ThreatTrendItem(date="Jul 06", safe=14, threats=6),
        ThreatTrendItem(date="Jul 07", safe=safe, threats=threats)
    ]

    return DashboardStatsResponse(
        totalScans=total,
        threatsDetected=threats,
        safeFiles=safe,
        deepfakesFound=deepfakes,
        phishingAttempts=phishing,
        recentActivity=recent,
        threatTrend=trend,
        scanTypesDistribution=dist_list,
        riskDistribution=risk_list
    )
