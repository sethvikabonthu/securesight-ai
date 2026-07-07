import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, ShieldAlert, RefreshCw, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { scanService } from '../services/api';
import type { ScanResult } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/Input';
import { Progress } from '../components/Progress';
import { useToast } from '../context/ToastContext';

export const ScanEmailPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { emailContent: '' }
  });
  const { showToast } = useToast();

  const onSubmit = async (data: { emailContent: string }) => {
    setScanning(true);
    setResult(null);
    showToast('Parsing email structure & urgency cues...', 'info');

    try {
      const scanResult = await scanService.scanEmail(data.emailContent);
      setResult(scanResult);
      showToast('Email threat heuristics scan complete.', 'success');
    } catch (err) {
      showToast('Scan failure. Email parse error.', 'error');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">EMAIL SOCIAL ENGINEERING SCANNER</h2>
        <p className="text-xs text-gray-400">Scan raw emails for coercive language triggers, malicious attachments, spoofed headers, and dangerous embedded shortlinks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Email Text & Headers Analyzer</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextArea
                  label="Raw Email Copy or Headers"
                  placeholder="Paste the full email contents, header details, or suspicious message text here..."
                  error={errors.emailContent?.message}
                  {...register('emailContent', { 
                    required: 'Email content is required to analyze social engineering patterns',
                    minLength: {
                      value: 15,
                      message: 'Paste at least 15 characters of the email body to execute analysis'
                    }
                  })}
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={scanning}
                >
                  Analyze Email Threat Markers
                </Button>
              </form>
            </CardContent>
          </Card>

          {scanning && (
            <Card variant="glass" className="p-6 scanner-beam overflow-hidden text-center">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyber-cyan animate-spin" />
                <span className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-widest">
                  RUNNING AI NLP LINGUISTIC CLASSIFIER...
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* Results Panel */}
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
                  {result.status === 'safe' ? 'Verified Safe' : 'Phishing Flagged'}
                </span>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-gray-400">Threat Score</p>
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

                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs text-gray-400 font-medium">Risk level</span>
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                    result.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400' :
                    result.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {result.riskLevel} Risk
                  </span>
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white tracking-wide block uppercase">Diagnostic Explanation</span>
                  <p className="text-xs text-gray-400 leading-relaxed bg-slate-950/40 p-3 border border-white/5 rounded-lg">
                    {result.explanation}
                  </p>
                </div>

                {/* Detected Issues */}
                {result.detectedIssues.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-white tracking-wide block uppercase">Flagged Indicators</span>
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

                {/* Recommendations */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white tracking-wide block uppercase">Incident Mitigations</span>
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
              <Search className="w-10 h-10 text-gray-500 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">Awaiting Email Copy</h4>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Paste raw email copy or full mail header text into the form to evaluate threats.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
