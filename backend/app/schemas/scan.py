from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UrlScanRequest(BaseModel):
    url: str

class EmailScanRequest(BaseModel):
    content: str

class SmsScanRequest(BaseModel):
    text: str

class ScanResponse(BaseModel):
    id: str
    fileName: Optional[str] = None
    fileSize: Optional[str] = None
    scanType: str
    status: str
    confidence: float
    riskLevel: str
    detectedIssues: List[str]
    explanation: str
    recommendedActions: List[str]
    metadata: Optional[Dict[str, Any]] = None
    timestamp: str

class RecentActivity(BaseModel):
    id: str
    action: str
    target: str
    status: str
    timestamp: str

class ThreatTrendItem(BaseModel):
    date: str
    safe: int
    threats: int

class ScanTypeDistItem(BaseModel):
    name: str
    value: int
    color: str

class RiskDistItem(BaseModel):
    name: str
    count: int

class DashboardStatsResponse(BaseModel):
    totalScans: int
    threatsDetected: int
    safeFiles: int
    deepfakesFound: int
    phishingAttempts: int
    recentActivity: List[RecentActivity]
    threatTrend: List[ThreatTrendItem]
    scanTypesDistribution: List[ScanTypeDistItem]
    riskDistribution: List[RiskDistItem]

class ReportResponse(BaseModel):
    id: str
    name: str
    date: str
    status: str
    scansAnalyzed: int
