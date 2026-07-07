import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldAlert, Layers, CheckSquare } from 'lucide-react';
import { scanService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { SkeletonCard, SkeletonLine } from '../components/Skeletons';
import { useToast } from '../context/ToastContext';

interface Report {
  id: string;
  name: string;
  date: string;
  status: string;
  scansAnalyzed: number;
}

export const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { showToast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await scanService.getReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      showToast('Error syncing threat intelligence reports.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownloadPdf = (report: Report) => {
    showToast(`Compiling detailed audit: "${report.name}"...`, 'info');
    setTimeout(() => {
      showToast('Diagnostic PDF report successfully compiled and downloaded (Placeholder).', 'success');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLine className="h-8 w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SkeletonCard className="h-80" />
          </div>
          <div className="lg:col-span-2">
            <SkeletonCard className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">THREAT AUDIT REPORTS</h2>
        <p className="text-xs text-gray-400">Generate, review, and export aggregated security audits and deepfake scanning logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Reports list */}
        <Card variant="glass" className="h-max">
          <CardHeader>
            <CardTitle>Generated Audits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedReport?.id === report.id 
                      ? 'bg-cyber-blue/15 border-l-2 border-cyber-cyan text-white' 
                      : 'hover:bg-white/[0.01] text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 shrink-0 text-cyber-cyan" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{report.name}</p>
                      <span className="text-[10px] text-gray-500 font-mono">{report.date}</span>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border border-green-500/25 bg-green-950/20 text-green-400 shrink-0">
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Detailed report overview */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <Card variant="glass" className="space-y-6">
              <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 py-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Report Ref: {selectedReport.id}</p>
                  <CardTitle className="text-base mt-0.5">{selectedReport.name}</CardTitle>
                </div>
                <Button 
                  onClick={() => handleDownloadPdf(selectedReport)}
                  className="flex items-center gap-1.5"
                  size="sm"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Statistics Cards inside Report */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-lg flex items-center gap-3">
                    <Layers className="w-8 h-8 text-cyber-cyan shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Scans Audited</span>
                      <span className="text-lg font-bold text-white font-mono">{selectedReport.scansAnalyzed}</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-lg flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Threat Matches</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {Math.floor(selectedReport.scansAnalyzed * 0.28)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-lg flex items-center gap-3">
                    <CheckSquare className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Safe Matches</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {Math.floor(selectedReport.scansAnalyzed * 0.72)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Threat Diagnostics Summary section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Executive Summary</h4>
                  <div className="text-xs text-gray-400 leading-relaxed bg-slate-950/40 p-4 border border-white/5 rounded-lg space-y-3">
                    <p>
                      This report compiles authentication telemetry logs gathered between <strong>{selectedReport.date}</strong> and today. Synthetic media checks inspect video frames for style-based GAN noise and voice clones for spectrogram frequency variance.
                    </p>
                    <p>
                      Phishing detection vectors analyzed smishing messages and credential harvesting URLs. Of the <strong>{selectedReport.scansAnalyzed}</strong> items processed, security algorithms successfully flagged and isolated threats with a global certainty threshold average of <strong>94.2%</strong>.
                    </p>
                  </div>
                </div>

                {/* Threat type breakdown list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Threat Vectors Flagged</h4>
                  <div className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/20 text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-900/40 border-b border-white/5 text-gray-400 font-semibold">
                          <th className="p-3">Vector Class</th>
                          <th className="p-3 text-center">Threat Count</th>
                          <th className="p-3 text-center">Detection Success</th>
                          <th className="p-3 text-right">Avg Certainty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        <tr>
                          <td className="p-3 font-semibold">Synthetic Audio / Deepfake</td>
                          <td className="p-3 text-center">4</td>
                          <td className="p-3 text-center text-green-400">100%</td>
                          <td className="p-3 text-right font-mono">96.8%</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">Credential Harvesting Link</td>
                          <td className="p-3 text-center">9</td>
                          <td className="p-3 text-center text-green-400">98%</td>
                          <td className="p-3 text-right font-mono">98.2%</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">Urgency/Spear Phishing Email</td>
                          <td className="p-3 text-center">3</td>
                          <td className="p-3 text-center text-yellow-400">92%</td>
                          <td className="p-3 text-right font-mono">84.1%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Policy Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Strategic Recommendations</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                      <span>Implement corporate training focusing on voice cloning spoofing templates.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                      <span>Integrate VeriShield automated URL scans directly into internal firewalls via custom API Keys.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card variant="glass" className="h-full border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8 min-h-[350px]">
              <FileText className="w-10 h-10 text-gray-500 mb-3 animate-pulse" />
              <h4 className="text-sm font-semibold text-white mb-1">Awaiting Report Query</h4>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Select an audit from the ledger panel to view detailed diagnostic statistics.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
