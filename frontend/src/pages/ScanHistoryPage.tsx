import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Eye, Download, ShieldQuestion, CheckCircle
} from 'lucide-react';
import { scanService } from '../services/api';
import type { ScanResult } from '../types';
import { Card, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SkeletonTable } from '../components/Skeletons';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { Progress } from '../components/Progress';

export const ScanHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal State
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await scanService.getHistory();
        setHistory(data);
      } catch (err) {
        showToast('Error syncing historical scan telemetry logs.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [showToast]);

  // Filtering Logic
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      (item.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.metadata?.url || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === 'all' || item.scanType === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const openScanDetails = (scan: ScanResult) => {
    setSelectedScan(scan);
    setModalOpen(true);
  };

  const handleDownloadPdfMock = () => {
    showToast('Compiling diagnostic PDF metadata report... Downloading...', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">HISTORICAL SCAN LEDGER</h2>
        <p className="text-xs text-gray-400">Complete cryptographic audit of all local security scans executed on this node.</p>
      </div>

      <Card variant="glass">
        <CardContent className="p-6 space-y-4">
          {/* Controls: Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search scans by filename, URL, or diagnostics text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            
            {/* Filter selectors */}
            <div className="flex gap-3 w-full md:w-auto shrink-0">
              <div className="flex flex-col gap-1 w-1/2 md:w-36">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scan Vector</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-white/10 text-gray-300 focus:outline-none focus:border-cyber-cyan cursor-pointer"
                >
                  <option value="all">All Vectors</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-1/2 md:w-36">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Audit Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-white/10 text-gray-300 focus:outline-none focus:border-cyber-cyan cursor-pointer"
                >
                  <option value="all">All States</option>
                  <option value="safe">Safe</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="danger">Danger</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table contents */}
          {loading ? (
            <SkeletonTable cols={6} rows={5} />
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-xl bg-slate-950/20">
              <ShieldQuestion className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">No scan entries match query</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Adjust your filters or type query terms to search again.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/5 bg-slate-950/25">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-white/5 text-gray-400 font-semibold tracking-wider uppercase select-none">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Target Source</th>
                    <th className="p-4">Scan Type</th>
                    <th className="p-4 text-center">Threat Status</th>
                    <th className="p-4 text-center">Confidence</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 whitespace-nowrap text-gray-400 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-white max-w-xs truncate">
                        {item.fileName || item.metadata?.url || (item.scanType === 'email' ? 'Email text snippet' : 'SMS text snippet')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-gray-300 tracking-wider">
                          {item.scanType}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === 'safe' ? 'bg-green-950/30 border border-green-500/25 text-green-400' :
                          item.status === 'suspicious' ? 'bg-yellow-950/30 border border-yellow-500/25 text-yellow-400' :
                          'bg-red-950/30 border border-red-500/25 text-red-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'safe' ? 'bg-green-400' :
                            item.status === 'suspicious' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-semibold font-mono text-white">
                        {item.confidence.toFixed(1)}%
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openScanDetails(item)}
                            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyber-cyan text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Inspect Diagnostics"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="VeriShield AI Diagnostics Report"
        size="lg"
      >
        {selectedScan && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 border border-white/5 rounded-lg">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID: {selectedScan.id}</p>
                <h4 className="text-sm font-bold text-white mt-0.5 truncate max-w-sm sm:max-w-md">
                  {selectedScan.fileName || selectedScan.metadata?.url || `${selectedScan.scanType.toUpperCase()} Scan`}
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                selectedScan.status === 'safe' 
                  ? 'bg-green-950/30 border border-green-500/25 text-green-400' 
                  : 'bg-red-950/30 border border-red-500/25 text-red-400'
              }`}>
                {selectedScan.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Diagnostics */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Model Explanation</span>
                  <p className="text-xs text-gray-300 leading-relaxed bg-slate-950/60 p-4 border border-white/5 rounded-lg">
                    {selectedScan.explanation}
                  </p>
                </div>

                {selectedScan.detectedIssues.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Anomalies Isolated</span>
                    <div className="space-y-1">
                      {selectedScan.detectedIssues.map((issue, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-red-400 font-medium">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Metadata & Recommendations */}
              <div className="space-y-4">
                {/* Confidence Bar */}
                <div className="space-y-1 bg-slate-900/20 p-4 border border-white/5 rounded-lg">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Model Certainty</span>
                    <span className="text-white">{selectedScan.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={selectedScan.confidence} 
                    color={selectedScan.status === 'safe' ? 'green' : 'red'} 
                    size="sm" 
                  />
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Mitigations Required</span>
                  <div className="space-y-1.5">
                    {selectedScan.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-gray-400">
                        <CheckCircle className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata items */}
                {selectedScan.metadata && (
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Metadata Schema</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      {Object.entries(selectedScan.metadata).map(([key, val]) => (
                        <div key={key} className="bg-slate-950/40 p-2 border border-white/5 rounded">
                          <span className="text-gray-500 block uppercase tracking-wider">{key}</span>
                          <span className="text-gray-300 truncate block mt-0.5">{val.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Close Diagnostics
              </Button>
              <Button onClick={handleDownloadPdfMock} className="flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download PDF Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
