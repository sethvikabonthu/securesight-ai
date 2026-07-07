export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export type ScanType = 'image' | 'video' | 'audio' | 'url' | 'email' | 'sms';

export type DetectionStatus = 'safe' | 'suspicious' | 'danger';

export interface ScanResult {
  id: string;
  fileName?: string;
  fileSize?: string;
  scanType: ScanType;
  status: DetectionStatus;
  confidence: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  detectedIssues: string[];
  explanation: string;
  recommendedActions: string[];
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  target: string;
  status: 'safe' | 'flagged';
  timestamp: string;
}

export interface DashboardStats {
  totalScans: number;
  threatsDetected: number;
  safeFiles: number;
  deepfakesFound: number;
  phishingAttempts: number;
  recentActivity: RecentActivity[];
  threatTrend: { date: string; safe: number; threats: number }[];
  scanTypesDistribution: { name: string; value: number; color: string }[];
  riskDistribution: { name: string; count: number }[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
  };
  language: string;
  apiKey: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
}
