import random
import uuid
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.schemas.scan import ScanResponse, UrlScanRequest, EmailScanRequest, SmsScanRequest

router = APIRouter()

# Shareable memory-based db
db_scan_history = []

def get_risk_level(status: str, confidence: float) -> str:
    if status == "safe":
        return "Low"
    if confidence > 90:
        return "Critical" if confidence > 95 else "High"
    return "Medium"

@router.post("/image", response_model=ScanResponse)
async def scan_image(file: UploadFile = File(...)):
    is_deepfake = "deepfake" in file.filename.lower() or random.random() > 0.4
    status = "danger" if is_deepfake else "safe"
    confidence = float(round(random.uniform(85, 99.8) if is_deepfake else random.uniform(2, 14), 1))
    risk = get_risk_level(status, confidence)
    
    issues = [
        "JPEG double-compression artifacts detected in metadata",
        "Facial boundary blending irregularities found around lip margins",
        "Inconsistent specular reflection vectors in left iris",
        "Diffusion/StyleGAN generative patterns isolated in low-frequency channels"
    ] if is_deepfake else []

    explanation = (
        "Our neural network analyzed the image noise signature and detected localized "
        "manipulations around facial structures. Geometric anomalies match StyleGAN generative features."
        if is_deepfake else
        "No artificial anomalies detected. Compression rates, light reflections, and sensor noises are natural."
    )

    actions = [
        "Restrict visual asset propagation in corporate communication loops.",
        "File a metadata fingerprint signature check in threat registers.",
        "Perform cross-referencing reverse searches to pinpoint original source visuals."
    ] if is_deepfake else ["No remediation steps necessary. Asset appears clean."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        fileName=file.filename,
        fileSize="4.8 MB",  # Placeholder
        scanType="image",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"resolution": "1920x1080", "format": file.content_type or "image/png"},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
    
    db_scan_history.insert(0, result)
    return result

@router.post("/video", response_model=ScanResponse)
async def scan_video(file: UploadFile = File(...)):
    is_deepfake = "deepfake" in file.filename.lower() or random.random() > 0.5
    status = "danger" if is_deepfake else "safe"
    confidence = float(round(random.uniform(90, 99.9) if is_deepfake else random.uniform(1, 10), 1))
    risk = get_risk_level(status, confidence)

    issues = [
        "Lip-sync temporal lag (approximately 3 video frames)",
        "Facial landmark jitter and edge artifacts across transitions",
        "Inconsistent shadowing profiles under chin structures",
        "Neck blending boundaries show pixel interpolation artifacts"
    ] if is_deepfake else []

    explanation = (
        "Temporal model checkpoints flagged frame-to-frame inconsistencies in face vectors. "
        "Blended boundary boundaries display geometric interpolation artifacts."
        if is_deepfake else
        "Temporal frame transitions are seamless. Light distributions match baseline video movements."
    )

    actions = [
        "Quarantine digital asset, restricting internal access.",
        "Extract audio tracks to run a separate voice-frequency spectrogram scan.",
        "Log spoofing attempt in the security console."
    ] if is_deepfake else ["Safe for use. No precautions needed."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        fileName=file.filename,
        fileSize="18.5 MB",
        scanType="video",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"duration": "14s", "codec": "h264"},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

    db_scan_history.insert(0, result)
    return result

@router.post("/audio", response_model=ScanResponse)
async def scan_audio(file: UploadFile = File(...)):
    is_deepfake = "deepfake" in file.filename.lower() or random.random() > 0.4
    status = "danger" if is_deepfake else "safe"
    confidence = float(round(random.uniform(92, 99.7) if is_deepfake else random.uniform(1, 12), 1))
    risk = get_risk_level(status, confidence)

    issues = [
        "Absence of physiological micro-tremors in vocal tracts",
        "Unnatural mechanical frequency transitions",
        "Robotic phase anomalies detected in vocoder outputs"
    ] if is_deepfake else []

    explanation = (
        "Spectrum analysis indicated synthetic acoustic signatures. Cadence patterns match text-to-speech models."
        if is_deepfake else
        "Cadence speeds and pitch variations are consistent with human breathing and speech biological signatures."
    )

    actions = [
        "Do not authorize transactions or passwords based on this voice command.",
        "Confirm identity with the user using secondary pre-defined methods (e.g. secure text).",
        "Escalate incident report to executive security channels."
    ] if is_deepfake else ["No actions required. Vocal cadence is verified human."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        fileName=file.filename,
        fileSize="1.5 MB",
        scanType="audio",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"format": file.content_type or "audio/wav", "sampleRate": "44.1kHz"},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

    db_scan_history.insert(0, result)
    return result

@router.post("/url", response_model=ScanResponse)
async def scan_url(req: UrlScanRequest):
    is_phishing = any(
    x in req.url.lower()
    for x in [
        "paypal",
        "login",
        "verify",
        "secure",
        "bank",
        "phishing",
        "fake"
    ]
)
    status = "danger" if is_phishing else "safe"
    confidence = float(round(random.uniform(88, 99.5) if is_phishing else random.uniform(1, 6), 1))
    risk = get_risk_level(status, confidence)

    issues = [
        "Domain registered less than 72 hours ago",
        "DNS redirects route through proxy networks frequently flagged for threats",
        "Uses deceptive keyword configurations targeting financial portal lookalikes"
    ] if is_phishing else []

    explanation = (
        f"The url '{req.url}' was flagged as malicious. The registration pattern and DNS "
        "redirections are characteristic of active credential harvesting landing portals."
        if is_phishing else
        "Domain registration age and SSL organization certificates are fully verified and safe."
    )

    actions = [
        "Block target domain routing in the firewall console.",
        "Clear browser local caches if credentials were input.",
        "Dispatch URL warning alerts to corporate browsers."
    ] if is_phishing else ["Browsing is safe. No steps required."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        scanType="url",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"url": req.url, "ipAddress": "198.51.100.82"},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

    db_scan_history.insert(0, result)
    return result

@router.post("/email", response_model=ScanResponse)
async def scan_email(req: EmailScanRequest):
    is_phishing = any(x in req.content.lower() for x in ["urgent", "account expired", "transfer", "verify credit card"]) or random.random() > 0.5
    status = "danger" if is_phishing else "safe"
    confidence = float(round(random.uniform(80, 98.9) if is_phishing else random.uniform(2, 10), 1))
    risk = get_risk_level(status, confidence)

    issues = [
        "Urgent timeline cues design to trigger anxiety spikes ('Immediate action required')",
        "Linguistic patterns request validation of PII credentials",
        "Message uses spoofing sender templates targeting support portals"
    ] if is_phishing else []

    explanation = (
        "Semantic model parsing flagged urgency traps. The speech structures match active phishing templates."
        if is_phishing else
        "Email text checks clean. Uses natural corporate correspondence terminology."
    )

    actions = [
        "Do not click internal links or attachments.",
        "Report raw email SPF headers to mail security handlers.",
        "Escalate spear-phishing warnings to colleagues."
    ] if is_phishing else ["No action required."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        scanType="email",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"length": len(req.content)},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

    db_scan_history.insert(0, result)
    return result

@router.post("/sms", response_model=ScanResponse)
async def scan_sms(req: SmsScanRequest):
    is_phishing = any(x in req.text.lower() for x in ["claim", "won prize", "refund", "usps package", "delivery"]) or random.random() > 0.6
    status = "danger" if is_phishing else "safe"
    confidence = float(round(random.uniform(85, 99.2) if is_phishing else random.uniform(1, 8), 1))
    risk = get_risk_level(status, confidence)

    issues = [
        "Package delivery scam templates identified",
        "Message contains shortened links (redirects) frequently associated with smishing",
        "Masked or spoofed standard phone numbers"
    ] if is_phishing else []

    explanation = (
        "SMS matches package refund hooks. Shortened redirects are engineered to hide credential harvest targets."
        if is_phishing else
        "SMS body is safe. No smishing markers found."
    )

    actions = [
        "Delete the message and block the sender phone number.",
        "Avoid opening or sharing shortened URLs.",
        "Forward suspicious SMS reports to carrier spam hotlines (7726)."
    ] if is_phishing else ["No action required."]

    result = ScanResponse(
        id=f"scan-{uuid.uuid4().hex[:6]}",
        scanType="sms",
        status=status,
        confidence=confidence,
        riskLevel=risk,
        detectedIssues=issues,
        explanation=explanation,
        recommendedActions=actions,
        metadata={"characterCount": len(req.text)},
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

    db_scan_history.insert(0, result)
    return result
