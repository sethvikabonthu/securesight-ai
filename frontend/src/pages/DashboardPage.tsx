import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Activity, AlertTriangle, 
  ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, 
  BarChart, Bar 
} from 'recharts';
import { scanService } from '../services/api';
import type { DashboardStats } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { SkeletonCard, SkeletonLine } from '../components/Skeletons';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await scanService.getDashboardStats();
      setStats(data);
    } catch (err) {
      showToast('Telemetry link failed. Unable to fetch stats.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
    showToast('Dashboard metrics refreshed.', 'success');
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <SkeletonLine className="h-8 w-1/4" />
          <SkeletonLine className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonCard className="h-80" />
          </div>
          <div>
            <SkeletonCard className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  // Define widgets details
  const widgets = [
    { title: 'Total Scans', count: stats.totalScans, icon: Activity, color: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20' },
    { title: 'Threats Detected', count: stats.threatsDetected, icon: ShieldAlert, color: 'text-red-500 bg-red-950/20 border-red-500/20' },
    { title: 'Safe Files', count: stats.safeFiles, icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-950/20 border-emerald-500/20' },
    { title: 'Deepfakes Found', count: stats.deepfakesFound, icon: Layers, color: 'text-purple-500 bg-purple-950/20 border-purple-500/20' },
    { title: 'Phishing Attempts', count: stats.phishingAttempts, icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-950/20 border-yellow-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SYSTEM OVERVIEW</h2>
          <p className="text-xs text-gray-400">VeriShield Unified Telemetry Monitor</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-cyber-cyan/30 text-xs font-semibold text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Synchronize Metrics
        </button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {widgets.map((w, idx) => {
          const Icon = w.icon;
          return (
            <Card key={idx} variant="glass" className="hover:border-white/10">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{w.title}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{w.count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${w.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Threat Detection Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.threatTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} 
                  labelStyle={{ color: '#fff', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="safe" name="Authentic Files" stroke="#10B981" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="threats" name="Threats Flagged" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scan Types Doughnut Chart */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Scan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.scanTypesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.scanTypesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[41%] left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Active Vector</span>
              <span className="text-xl font-bold text-white tracking-tight">{stats.scanTypesDistribution.length} Types</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risks & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Bar Chart */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Risk Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.riskDistribution} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {stats.riskDistribution.map((_, index) => {
                    const colors = ['#3B82F6', '#F59E0B', '#EF4444', '#7C3AED'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center flex-row border-b border-white/5 py-4">
            <CardTitle>Console Activity Stream</CardTitle>
            <span 
              onClick={() => navigate('/history')}
              className="text-[11px] font-semibold text-cyber-cyan hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Full Log <ChevronRight className="w-3 h-3" />
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      act.status === 'safe' 
                        ? 'bg-green-500 shadow-glow-green/30' 
                        : 'bg-red-500 shadow-glow-red/30'
                    }`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-white tracking-wide">{act.action}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-md">{act.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      act.status === 'safe' 
                        ? 'bg-green-950/30 border border-green-500/25 text-green-400' 
                        : 'bg-red-950/30 border border-red-500/25 text-red-400'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
