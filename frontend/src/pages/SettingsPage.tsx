import React from 'react';
import { 
  Settings, Bell, Key, Eye, HelpCircle, Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAuth();
  const { showToast } = useToast();

  const handleThemeChange = (theme: 'dark' | 'light') => {
    updateSettings({ theme });
    showToast(`Visual theme set to ${theme.toUpperCase()}`, 'success');
  };

  const handleNotificationChange = (key: 'emailAlerts' | 'pushNotifications' | 'weeklyDigest', val: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: val,
      }
    });
    showToast('Telemetry alert routing parameters updated.', 'info');
  };

  const handleAccessibilityChange = (key: 'highContrast' | 'largeText' | 'reducedMotion', val: boolean) => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        [key]: val,
      }
    });
    showToast('Accessibility display matrix altered.', 'success');
  };

  const handleApiKeySave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    updateSettings({ apiKey });
    showToast('Custom model API credentials cryptographically committed.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">CONSOLE CONFIGURATION</h2>
        <p className="text-xs text-gray-400">Configure layout preferences, accessibility adjustments, notification hooks, and API integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: General Settings */}
        <div className="space-y-6">
          {/* Theme card */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle><Eye className="w-4 h-4 text-cyber-cyan" /> Visual Appearance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold uppercase tracking-wider">Console Palette Theme</span>
                <div className="flex bg-slate-950 p-1 border border-white/5 rounded-lg">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                      settings.theme === 'dark' 
                        ? 'bg-cyber-blue text-white shadow-glow-blue/20' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Dark mode
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                      settings.theme === 'light' 
                        ? 'bg-cyber-blue text-white shadow-glow-blue/20' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Light mode
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle><Bell className="w-4 h-4 text-cyber-cyan" /> Protection Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white uppercase tracking-wider">Instant Email Alerts</p>
                  <p className="text-gray-500 text-[10px]">Dispatch audit warnings immediately when high-risk deepfakes are found.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyber-cyan focus:ring-cyber-cyan/30 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white uppercase tracking-wider">Browser Push Notices</p>
                  <p className="text-gray-500 text-[10px]">Show instant alert triggers in local system notification trays.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyber-cyan focus:ring-cyber-cyan/30 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white uppercase tracking-wider">Weekly Security Digest</p>
                  <p className="text-gray-500 text-[10px]">Send email summaries analyzing corporate threat metrics breakdowns.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyDigest}
                  onChange={(e) => handleNotificationChange('weeklyDigest', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyber-cyan focus:ring-cyber-cyan/30 w-4 h-4 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: API settings & Accessibility */}
        <div className="space-y-6">
          {/* Custom API Integrations */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle><Key className="w-4 h-4 text-cyber-cyan" /> Model API Integrations</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleApiKeySave} className="space-y-4">
                <Input
                  label="VeriShield Custom model Key"
                  type="password"
                  name="apiKey"
                  defaultValue={settings.apiKey}
                  placeholder="vsh_key_••••••••••••••••••••"
                />
                
                <div className="bg-slate-950/40 p-3 border border-white/5 rounded-lg flex gap-2.5 items-start text-xs">
                  <HelpCircle className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    By default, the terminal runs fully functional local heuristics simulations. Providing a valid API key hooks the console scanner routers up to live AI models.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="flex items-center gap-1">
                    <Save className="w-3.5 h-3.5" /> Commit API Credentials
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Accessibility Adjustments */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle><Settings className="w-4 h-4 text-cyber-cyan" /> Accessibility Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white uppercase tracking-wider">High Contrast Overlay</p>
                  <p className="text-gray-500 text-[10px]">Boost brightness layers and border stroke definitions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.accessibility.highContrast}
                  onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyber-cyan focus:ring-cyber-cyan/30 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white uppercase tracking-wider">Reduced Motion Speeds</p>
                  <p className="text-gray-500 text-[10px]">Mute CSS translations, slide transitions, and line graph loading scales.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.accessibility.reducedMotion}
                  onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyber-cyan focus:ring-cyber-cyan/30 w-4 h-4 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
