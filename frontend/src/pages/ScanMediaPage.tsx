import React, { useState, useRef } from 'react';
import { 
  UploadCloud, File, ShieldCheck, ShieldAlert, 
  RefreshCw, CheckCircle, AlertTriangle, Layers, Trash2
} from 'lucide-react';
import { scanService } from '../services/api';
import type { ScanResult, ScanType } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Progress } from '../components/Progress';
import { useToast } from '../context/ToastContext';

export const ScanMediaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScanType>('image');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanningPhase, setScanningPhase] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [scanningStepText, setScanningStepText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFileType = (file: File, type: ScanType): boolean => {
    const fileType = file.type.split('/')[0];
    if (type === 'image' && fileType !== 'image') {
      showToast('Selected file must be an image.', 'error');
      return false;
    }
    if (type === 'video' && fileType !== 'video') {
      showToast('Selected file must be a video.', 'error');
      return false;
    }
    if (type === 'audio' && fileType !== 'audio') {
      showToast('Selected file must be an audio track.', 'error');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFileType(droppedFile, activeTab)) {
        setFile(droppedFile);
        setResult(null);
        setScanningPhase('idle');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFileType(selectedFile, activeTab)) {
        setFile(selectedFile);
        setResult(null);
        setScanningPhase('idle');
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const startScan = async () => {
    if (!file) return;

    // Phase 1: Simulated Upload
    setScanningPhase('uploading');
    setUploadProgress(0);
    setScanningStepText('Uploading digital asset...');
    
    for (let p = 0; p <= 100; p += 20) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 150));
    }

    // Phase 2: Simulated Analysis
    setScanningPhase('analyzing');
    setUploadProgress(100);
    
    const steps = [
      'Extracting frame metadata & metadata tags...',
      'Mapping RGB frequency noise matrices...',
      'Verifying landmark spatial coherence...',
      'Computing GAN fingerprint probability thresholds...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanningStepText(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    // Phase 3: Done
    try {
      let scanResult: ScanResult;
      if (activeTab === 'image') {
        scanResult = await scanService.scanImage(file);
      } else if (activeTab === 'video') {
        scanResult = await scanService.scanVideo(file);
      } else {
        scanResult = await scanService.scanAudio(file);
      }
      setResult(scanResult);
      setScanningPhase('done');
      showToast('AI verification analysis complete.', 'success');
    } catch (err) {
      showToast('Scan failure. Network verification failed.', 'error');
      setScanningPhase('idle');
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setScanningPhase('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SYNTHETIC MEDIA VERIFICATION</h2>
        <p className="text-xs text-gray-400">Validate file authenticity and detect deepfakes, AI voice clones, and GAN-synthesized frames.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Control Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex gap-2 p-0 border-b border-white/5">
              {(['image', 'video', 'audio'] as ScanType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    removeFile();
                  }}
                  className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab 
                      ? 'border-cyber-cyan text-white bg-cyber-blue/5' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  {tab} scanner
                </button>
              ))}
            </CardHeader>
            <CardContent className="p-6">
              {/* Drag and Drop Zone */}
              {!file && (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-glow-cyan/10' 
                      : 'border-white/10 hover:border-cyber-blue/40 bg-slate-900/10'
                  }`}
                  onClick={triggerFileSelect}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={
                      activeTab === 'image' ? 'image/*' :
                      activeTab === 'video' ? 'video/*' :
                      'audio/*'
                    }
                  />
                  <UploadCloud className="w-12 h-12 text-gray-500 mb-4 animate-bounce" />
                  <p className="text-sm font-semibold text-white mb-1">
                    Drag and drop your {activeTab} file here
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mb-4">
                    Supports PNG, JPEG, MP4, MOV, MP3, WAV up to 50MB. Safe, encrypted analysis.
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Browse Files
                  </Button>
                </div>
              )}

              {/* File Selected Area */}
              {file && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-cyber-blue/10 rounded flex items-center justify-center shrink-0">
                        <File className="w-5 h-5 text-cyber-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-white/5 hover:text-red-400 rounded-lg text-gray-400 transition-all cursor-pointer shrink-0"
                      title="Clear Selection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scanning Phase Screen */}
                  {scanningPhase === 'idle' && (
                    <Button onClick={startScan} className="w-full">
                      Start Authenticity Scan
                    </Button>
                  )}

                  {scanningPhase === 'uploading' && (
                    <div className="space-y-3">
                      <Progress value={uploadProgress} label={scanningStepText} showValue />
                    </div>
                  )}

                  {scanningPhase === 'analyzing' && (
                    <div className="space-y-4 text-center py-4 relative border border-cyber-cyan/10 rounded-lg bg-cyber-cyan/5 overflow-hidden scanner-beam">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <RefreshCw className="w-5 h-5 text-cyber-cyan animate-spin" />
                        <span className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-widest">{scanningStepText}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">VeriShield Neural Models inspecting high-frequency artifacts...</p>
                    </div>
                  )}

                  {scanningPhase === 'done' && (
                    <Button onClick={removeFile} variant="secondary" className="w-full">
                      Scan Another File
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scan Result Dashboard */}
        <div>
          {result ? (
            <Card variant="glass" className={`border-t-4 ${
              result.status === 'safe' 
                ? 'border-t-green-500 shadow-glow-green/5' 
                : 'border-t-red-500 shadow-glow-red/5'
            }`}>
              <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 py-4">
                <CardTitle className="text-sm">Scan Result</CardTitle>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  result.status === 'safe' 
                    ? 'bg-green-950/30 border border-green-500/20 text-green-400' 
                    : 'bg-red-950/30 border border-red-500/20 text-red-400'
                }`}>
                  {result.status === 'safe' ? 'Authentic Frame' : 'Deepfake / Synthetic'}
                </span>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Confidence display */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-gray-400">AI Confidence Score</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${
                    result.status === 'safe' 
                      ? 'border-green-500/20 bg-green-500/10 text-green-400' 
                      : 'border-red-500/20 bg-red-500/10 text-red-400'
                  }`}>
                    {result.status === 'safe' ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                </div>

                <Progress 
                  value={result.confidence} 
                  color={result.status === 'safe' ? 'green' : 'red'} 
                  size="sm" 
                />

                {/* Risk Severity Level */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs text-gray-400 font-medium">Risk Assessment</span>
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                    result.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400' :
                    result.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {result.riskLevel} Risk
                  </span>
                </div>

                {/* Detailed Analysis Explanation */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white tracking-wide block uppercase">AI Model Diagnostics</span>
                  <p className="text-xs text-gray-400 leading-relaxed bg-slate-950/40 p-3 border border-white/5 rounded-lg">
                    {result.explanation}
                  </p>
                </div>

                {/* Specific issues detected */}
                {result.detectedIssues.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-white tracking-wide block uppercase">Flagged Anomalies</span>
                    <ul className="space-y-1 text-[11px] text-gray-300">
                      {result.detectedIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Actions */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white tracking-wide block uppercase">Recommended Mitigations</span>
                  <div className="space-y-1.5">
                    {result.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[11px] text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card variant="glass" className="h-full border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 min-h-[350px]">
              <Layers className="w-10 h-10 text-gray-500 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">Awaiting Diagnostic Input</h4>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Select a tab and upload a media asset file to start AI inspection.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
