import type { ScanResult, DashboardStats, RecentActivity } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// In-memory mock database for history
let mockScanHistory: ScanResult[] = [
  {
    id: 'scan-1001',
    fileName: 'ceo_voice_clone.mp3',
    fileSize: '2.4 MB',
    scanType: 'audio',
    status: 'danger',
    confidence: 96.8,
    riskLevel: 'Critical',
    detectedIssues: [
      'Frequency spectrum anomalies at 4.2kHz',
      'Artificial silence patterns between phrases',
      'Lack of natural breath sounds',
      'Phase incoherence characteristic of voice conversion models'
    ],
    explanation: 'The audio sample exhibits significant synthetic artifacts typical of neural voice cloning algorithms (e.g., ElevenLabs or tortoise-tts). There is a 96.8% probability that this audio is synthetically generated.',
    recommendedActions: [
      'Do not authorize any financial transactions requested in this audio.',
      'Verify the speaker identity via a secondary, pre-established channel.',
      'Report the incident to the internal security response team.'
    ],
    metadata: {
      duration: '45 seconds',
      format: 'MP3',
      sampleRate: '44.1 kHz'
    },
    timestamp: '2026-07-07T14:32:00Z'
  },
  {
    id: 'scan-1002',
    fileName: 'executive_headshot_update.png',
    fileSize: '5.1 MB',
    scanType: 'image',
    status: 'safe',
    confidence: 12.4,
    riskLevel: 'Low',
    detectedIssues: [],
    explanation: 'No synthetic media signatures detected. Image noise distributions and lighting vectors are consistent with natural photographic captures.',
    recommendedActions: [
      'No immediate actions required. File appears authentic.'
    ],
    metadata: {
      resolution: '3840x2160',
      camera: 'Sony ILCE-7M3',
      colorSpace: 'sRGB'
    },
    timestamp: '2026-07-07T12:15:00Z'
  },
  {
    id: 'scan-1003',
    scanType: 'url',
    status: 'danger',
    confidence: 98.2,
    riskLevel: 'High',
    detectedIssues: [
      'Domain age: Registered less than 24 hours ago',
      'SSL Certificate: Free Let\'s Encrypt with mismatching SANs',
      'Suspicious Top Level Domain (TLD): .xyz',
      'Homoglyph attack: Uses lookalike Cyrillic characters'
    ],
    explanation: 'The URL "https://secure-login-paypal.xyz" is classified as dangerous. It displays characteristics of a credential harvesting landing page designed to mimic financial services.',
    recommendedActions: [
      'Do not click or enter credentials on this URL.',
      'Block the domain at the company DNS/firewall level.',
      'Notify team members of potential spear-phishing campaigns.'
    ],
    metadata: {
      url: 'https://secure-login-paypal.xyz',
      ipAddress: '198.51.100.42',
      hostingProvider: 'Namecheap Hosting'
    },
    timestamp: '2026-07-07T10:04:00Z'
  },
  {
    id: 'scan-1004',
    scanType: 'email',
    status: 'suspicious',
    confidence: 68.5,
    riskLevel: 'Medium',
    detectedIssues: [
      'Urgent call to action (high emotional trigger)',
      'Mismatched sender header and return path',
      'Link points to an external unrecognized domain'
    ],
    explanation: 'This email displays signs of social engineering. It attempts to create a false sense of urgency regarding password expiration while directing links to an unofficial domain.',
    recommendedActions: [
      'Do not click any link inside the email.',
      'Inspect the raw email headers for SPF, DKIM, and DMARC failures.',
      'Flag the email as suspicious in your mail client.'
    ],
    metadata: {
      sender: 'admin-alert@security-verishield.com',
      subject: 'URGENT: Suspicious activity on your account - Action Required',
      linksFound: 1
    },
    timestamp: '2026-07-06T18:45:00Z'
  },
  {
    id: 'scan-1005',
    scanType: 'sms',
    status: 'danger',
    confidence: 94.1,
    riskLevel: 'High',
    detectedIssues: [
      'Smishing pattern: Urgent request to resolve package delivery issues',
      'Direct link containing a shortener service (bit.ly)',
      'Unrecognized originating number'
    ],
    explanation: 'This SMS message uses standard package delivery scam templates (smishing) to harvest personal information and credit card details.',
    recommendedActions: [
      'Do not open the shortlink.',
      'Block the sender phone number.',
      'Forward the SMS to 7726 (SPAM reporting line).'
    ],
    metadata: {
      senderNumber: '+1 (555) 934-8821',
      linksFound: 1
    },
    timestamp: '2026-07-06T15:20:00Z'
  }
];

// Helper to simulate API call latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scanService = {
  /**
   * Universal fetch with fallback to mock data
   */
  async request<T>(endpoint: string, options: RequestInit, mockFallback: T): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.warn(`VeriShield API service down or unavailable. Falling back to local AI simulation.`, error);
      await delay(1200); // Realistic AI inference lag
      return mockFallback;
    }
  },

  async scanImage(file: File): Promise<ScanResult> {
    // Generate dummy scanner result for images
    const isDeepfake = file.name.toLowerCase().includes('deepfake') || Math.random() > 0.4;
    
    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      scanType: 'image',
      status: isDeepfake ? 'danger' : 'safe',
      confidence: isDeepfake ? parseFloat((85 + Math.random() * 14.8).toFixed(1)) : parseFloat((5 + Math.random() * 10).toFixed(1)),
      riskLevel: isDeepfake ? 'High' : 'Low',
      detectedIssues: isDeepfake ? [
        'JPEG double-compression artifacts',
        'Facial boundary blending irregularities',
        'Inconsistent eye reflection vectors',
        'Generative adversarial network (GAN) texture signatures'
      ] : [],
      explanation: isDeepfake
        ? `Our image analysis pipeline detected strong generative artifacts. Specific patterns in the frequency domain match style-based generators (such as StyleGAN or Midjourney), with local anomalies around facial borders.`
        : `Analysis completed. The image exhibits normal sensor noise distributions and geometric features. No traces of AI generation detected.`,
      recommendedActions: isDeepfake ? [
        'Restrict dissemination of this visual asset in official channels.',
        'Flag this image as AI-generated in internal databases.',
        'Run reverse image searches to locate source footage.'
      ] : ['File is safe to use. no actions required.'],
      metadata: {
        resolution: '1920x1080 px',
        mimeType: file.type,
      },
      timestamp: new Date().toISOString()
    };

    // Add to history
    mockScanHistory.unshift(mockResult);

    // Call actual backend endpoint
    const formData = new FormData();
    formData.append('file', file);

    return this.request<ScanResult>('/scan/image', {
      method: 'POST',
      body: formData,
      headers: {
        // Leave headers empty for FormData boundary
      } as any,
    }, mockResult);
  },

  async scanVideo(file: File): Promise<ScanResult> {
    const isDeepfake = file.name.toLowerCase().includes('deepfake') || Math.random() > 0.5;

    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      scanType: 'video',
      status: isDeepfake ? 'danger' : 'safe',
      confidence: isDeepfake ? parseFloat((90 + Math.random() * 9.5).toFixed(1)) : parseFloat((2 + Math.random() * 12).toFixed(1)),
      riskLevel: isDeepfake ? 'Critical' : 'Low',
      detectedIssues: isDeepfake ? [
        'Lip-sync temporal mismatches (3 frames lag)',
        'Facial landmark jitter across keyframes',
        'Inconsistent lighting shadows under the chin',
        'Blending seams around the neck area'
      ] : [],
      explanation: isDeepfake
        ? `Temporal analysis of the video indicates facial blending overlays. The facial expression movements are unaligned with the underlying audio stream, and edge boundary artifacts are present in high-frequency channels.`
        : `The video sequence appears authentic. No frame-to-frame facial transformations or structural anomalies were detected.`,
      recommendedActions: isDeepfake ? [
        'Quarantine this file immediately.',
        'Do not share this video on social media or official channels.',
        'Extract audio track for separate authentication.'
      ] : ['Safe file. No security actions required.'],
      metadata: {
        duration: '12 seconds',
        codec: 'h264',
        fps: 30
      },
      timestamp: new Date().toISOString()
    };

    mockScanHistory.unshift(mockResult);

    const formData = new FormData();
    formData.append('file', file);

    return this.request<ScanResult>('/scan/video', {
      method: 'POST',
      body: formData,
    }, mockResult);
  },

  async scanAudio(file: File): Promise<ScanResult> {
    const isDeepfake = file.name.toLowerCase().includes('deepfake') || Math.random() > 0.4;

    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      scanType: 'audio',
      status: isDeepfake ? 'danger' : 'safe',
      confidence: isDeepfake ? parseFloat((93 + Math.random() * 6).toFixed(1)) : parseFloat((1 + Math.random() * 10).toFixed(1)),
      riskLevel: isDeepfake ? 'High' : 'Low',
      detectedIssues: isDeepfake ? [
        'Absence of micro-tremors in vocal cords',
        'Unnatural robotic harmonic repetitions',
        'Sub-band spectral footprint anomalies'
      ] : [],
      explanation: isDeepfake
        ? `The voice recording shows indicators of neural text-to-speech engine generation. The lack of standard biological breathing sounds and micro-variations in pitch confirms it is synthetic.`
        : `Vocal patterns are natural. Harmonic structure and speech cadence match human biological characteristics.`,
      recommendedActions: isDeepfake ? [
        'Double-check identity via another contact method.',
        'Report this to cybersecurity operations.',
        'Treat any voice instructions in the file as suspect.'
      ] : ['No actions needed.'],
      metadata: {
        bitRate: '320 kbps',
        format: file.type || 'audio/wav',
      },
      timestamp: new Date().toISOString()
    };

    mockScanHistory.unshift(mockResult);

    const formData = new FormData();
    formData.append('file', file);

    return this.request<ScanResult>('/scan/audio', {
      method: 'POST',
      body: formData,
    }, mockResult);
  },

  async scanUrl(url: string): Promise<ScanResult> {
    const isPhishing = url.toLowerCase().includes('paypal') || url.toLowerCase().includes('login') || url.toLowerCase().includes('verify') || Math.random() > 0.6;
    
    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      scanType: 'url',
      status: isPhishing ? 'danger' : 'safe',
      confidence: isPhishing ? parseFloat((88 + Math.random() * 11).toFixed(1)) : parseFloat((1 + Math.random() * 5).toFixed(1)),
      riskLevel: isPhishing ? 'High' : 'Low',
      detectedIssues: isPhishing ? [
        'Uses phishing keywords: "login", "secure", "verify"',
        'Unregistered domain with zero global web traffic',
        'Hosting IP blacklisted on 3 threat intelligence databases',
        'No official SSL organization verification'
      ] : [],
      explanation: isPhishing
        ? `The domain matches registered threat signatures for malicious redirects. It mimics official login portals to harvest authorization codes and passwords.`
        : `The domain is safe. It is highly ranked on Alexa and has a valid SSL certificate issued to a verified corporation.`,
      recommendedActions: isPhishing ? [
        'Block URL on the proxy/firewall.',
        'Do not input corporate emails or credentials.',
        'File a report to Google Safe Browsing and Netcraft.'
      ] : ['You can browse safely.'],
      metadata: {
        url,
        ipAddress: '185.220.101.4',
        domainAge: '3 days'
      },
      timestamp: new Date().toISOString()
    };

    mockScanHistory.unshift(mockResult);

    return this.request<ScanResult>('/scan/url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }, mockResult);
  },

  async scanEmail(content: string): Promise<ScanResult> {
    const isPhishing = content.toLowerCase().includes('urgent') || content.toLowerCase().includes('bank') || content.toLowerCase().includes('account') || Math.random() > 0.5;

    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      scanType: 'email',
      status: isPhishing ? 'danger' : 'safe',
      confidence: isPhishing ? parseFloat((80 + Math.random() * 18).toFixed(1)) : parseFloat((2 + Math.random() * 15).toFixed(1)),
      riskLevel: isPhishing ? 'High' : 'Low',
      detectedIssues: isPhishing ? [
        'High urgency vocabulary ("immediate", "action required")',
        'Requests verification of sensitive PII',
        'Contains links with redirect sequences',
        'Sender spoofing signatures'
      ] : [],
      explanation: isPhishing
        ? `The email is highly likely to be a spear-phishing attack. The linguistic analysis indicates a sense of urgency commonly used to coerce users into compromising security controls.`
        : `Email content analyzed. The message uses natural communications vocabulary. No malicious links or coercive speech patterns detected.`,
      recommendedActions: isPhishing ? [
        'Do not click any embedded links.',
        'Report this email using the phishing reporting button.',
        'Contact the sender via internal Slack/Teams to confirm if they sent it.'
      ] : ['Safe to read.'],
      metadata: {
        length: `${content.length} characters`,
        linksFound: content.match(/https?:\/\/[^\s]+/g)?.length || 0,
      },
      timestamp: new Date().toISOString()
    };

    mockScanHistory.unshift(mockResult);

    return this.request<ScanResult>('/scan/email', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }, mockResult);
  },

  async scanSms(text: string): Promise<ScanResult> {
    const isPhishing = text.toLowerCase().includes('win') || text.toLowerCase().includes('claim') || text.toLowerCase().includes('delivery') || Math.random() > 0.6;

    const mockResult: ScanResult = {
      id: `scan-${Math.floor(10000 + Math.random() * 90000)}`,
      scanType: 'sms',
      status: isPhishing ? 'danger' : 'safe',
      confidence: isPhishing ? parseFloat((85 + Math.random() * 14).toFixed(1)) : parseFloat((1 + Math.random() * 8).toFixed(1)),
      riskLevel: isPhishing ? 'High' : 'Low',
      detectedIssues: isPhishing ? [
        'Urgent financial benefit promise ("win prize", "claim refund")',
        'Shortened URL link inside text',
        'Suspicious standard phone number length'
      ] : [],
      explanation: isPhishing
        ? `Smishing text pattern matched. The message impersonates an authority (postal, banking, government) with an urgent link to steal personal payment data.`
        : `The text messages do not trigger any spam/phishing heuristics.`,
      recommendedActions: isPhishing ? [
        'Do not tap the link.',
        'Report sender number to carrier service.',
        'Delete the SMS.'
      ] : ['Safe.'],
      metadata: {
        characterCount: text.length,
        linksCount: text.match(/https?:\/\/[^\s]+/g)?.length || 0,
      },
      timestamp: new Date().toISOString()
    };

    mockScanHistory.unshift(mockResult);

    return this.request<ScanResult>('/scan/sms', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }, mockResult);
  },

  async getHistory(): Promise<ScanResult[]> {
    return this.request<ScanResult[]>('/history', {
      method: 'GET',
    }, mockScanHistory);
  },

  async getReports(): Promise<any[]> {
    // Return aggregated report data
    const reports = [
      { id: 'rep-201', name: 'Weekly Threat Summary', date: '2026-07-06', status: 'Generated', scansAnalyzed: 45 },
      { id: 'rep-202', name: 'Synthetic Media Audit - Q2', date: '2026-07-01', status: 'Generated', scansAnalyzed: 198 },
      { id: 'rep-203', name: 'Credential Harvesting Analysis', date: '2026-06-25', status: 'Generated', scansAnalyzed: 74 },
    ];
    return this.request<any[]>('/reports', {
      method: 'GET',
    }, reports);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const history = await this.getHistory();
    const threats = history.filter(h => h.status === 'danger' || h.status === 'suspicious');
    const safe = history.filter(h => h.status === 'safe');
    const deepfakes = history.filter(h => (h.scanType === 'image' || h.scanType === 'video' || h.scanType === 'audio') && (h.status === 'danger' || h.status === 'suspicious'));
    const phishing = history.filter(h => (h.scanType === 'url' || h.scanType === 'email' || h.scanType === 'sms') && (h.status === 'danger' || h.status === 'suspicious'));

    const recentActivity: RecentActivity[] = history.slice(0, 5).map(h => ({
      id: h.id,
      action: `Scanned ${h.scanType.toUpperCase()}`,
      target: h.fileName || (h.metadata?.url as string) || (h.scanType === 'email' ? 'Email Text' : 'SMS Text'),
      status: h.status === 'safe' ? 'safe' : 'flagged',
      timestamp: h.timestamp
    }));

    const mockStats: DashboardStats = {
      totalScans: history.length,
      threatsDetected: threats.length,
      safeFiles: safe.length,
      deepfakesFound: deepfakes.length,
      phishingAttempts: phishing.length,
      recentActivity,
      threatTrend: [
        { date: 'Jul 01', safe: 4, threats: 1 },
        { date: 'Jul 02', safe: 6, threats: 3 },
        { date: 'Jul 03', safe: 8, threats: 2 },
        { date: 'Jul 04', safe: 12, threats: 4 },
        { date: 'Jul 05', safe: 15, threats: 6 },
        { date: 'Jul 06', safe: 18, threats: 8 },
        { date: 'Jul 07', safe: history.filter(h => h.status === 'safe').length, threats: history.filter(h => h.status !== 'safe').length },
      ],
      scanTypesDistribution: [
        { name: 'Images', value: history.filter(h => h.scanType === 'image').length, color: '#3B82F6' },
        { name: 'Videos', value: history.filter(h => h.scanType === 'video').length, color: '#EF4444' },
        { name: 'Audio', value: history.filter(h => h.scanType === 'audio').length, color: '#10B981' },
        { name: 'URLs', value: history.filter(h => h.scanType === 'url').length, color: '#F59E0B' },
        { name: 'Emails', value: history.filter(h => h.scanType === 'email').length, color: '#8B5CF6' },
        { name: 'SMS', value: history.filter(h => h.scanType === 'sms').length, color: '#EC4899' },
      ].filter(d => d.value > 0),
      riskDistribution: [
        { name: 'Low Risk', count: history.filter(h => h.riskLevel === 'Low').length },
        { name: 'Medium Risk', count: history.filter(h => h.riskLevel === 'Medium').length },
        { name: 'High Risk', count: history.filter(h => h.riskLevel === 'High').length },
        { name: 'Critical Risk', count: history.filter(h => h.riskLevel === 'Critical').length },
      ]
    };

    return this.request<DashboardStats>('/stats', {
      method: 'GET',
    }, mockStats);
  }
};
