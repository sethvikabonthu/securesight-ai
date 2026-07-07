import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Brain, Zap, Globe, FileImage, 
  MessageSquare, Mail, Award, CheckCircle, ChevronRight, HelpCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Deepfake Video Detection',
      desc: 'Frame-by-frame blending search, lighting vector check, and lip-sync mismatch analysis.',
      icon: FileImage,
      color: 'text-red-400 border-red-500/20 bg-red-950/10'
    },
    {
      title: 'Voice Clone Identification',
      desc: 'Audio spectrum inspection looking for synthesized vocoder footprints and breath pauses.',
      icon: Brain,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10'
    },
    {
      title: 'Credential Harvesting Scans',
      desc: 'Domain history analysis, homoglyph attack lookup, and malicious redirect monitoring.',
      icon: Globe,
      color: 'text-blue-400 border-blue-500/20 bg-blue-950/10'
    },
    {
      title: 'Email Spoofing Audits',
      desc: 'Heuristic scans checking for urgent phrasing, sender headers, and malicious redirect links.',
      icon: Mail,
      color: 'text-purple-400 border-purple-500/20 bg-purple-950/10'
    },
    {
      title: 'Smishing SMS Filters',
      desc: 'Scans SMS messages for urgent phishing patterns and shortened link redirects.',
      icon: MessageSquare,
      color: 'text-pink-400 border-pink-500/20 bg-pink-950/10'
    },
    {
      title: 'GAN Image Fingerprinting',
      desc: 'Frequency anomalies and sensor noise patterns detection to expose AI-generated imagery.',
      icon: Shield,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'Upload or Paste Content', desc: 'Submit files (image, video, audio) or copy-paste text (URL, email, SMS) into the unified scanner interface.' },
    { step: '02', title: 'Deep Neural Analysis', desc: 'VeriShield\'s model array processes metadata, compression anomalies, and NLP structures concurrently.' },
    { step: '03', title: 'Generate Diagnostic Report', desc: 'Review detailed threat levels, risk distribution, specific issue markers, and remediation paths.' },
  ];

  const faqs = [
    { q: 'How does VeriShield detect deepfakes?', a: 'We employ multi-modal deep learning models. For video, we analyze frame temporal coherence and facial landmark consistency. For audio, we look for acoustic vocoder patterns.' },
    { q: 'What is your domain reputation analysis based on?', a: 'Our URL scanner integrates global threat intelligence, WHOIS registration age, SSL validity profiles, and homoglyph (lookalike characters) checks.' },
    { q: 'Can I integrate my custom AI models?', a: 'Yes! The API configuration module in Settings allows enterprise users to provide their custom AI endpoint keys for private testing.' }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-gray overflow-x-hidden selection:bg-cyber-cyan/30 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-cyber-cyan shadow-glow-cyan/50" />
          <span className="font-bold text-lg text-white tracking-widest">VERISHIELD AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register">
            <Button variant="outline" size="sm">
              Register Console
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyber-cyan/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 bg-cyber-cyan/10 rounded-full text-xs font-semibold text-cyber-cyan tracking-wider uppercase mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Cybersecurity Shield
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
          AI-Powered Detection of <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyan-400 bg-clip-text text-transparent">Synthetic Media</span> & Phishing Threats
        </h1>

        <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed mb-8">
          Protect your organization from credential harvesting, social engineering smishing templates, deepfake voice clones, and synthetic media scams with a single unified dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login">
            <Button size="lg" className="w-48">
              Access Console <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/login?demo=true">
            <Button variant="outline" size="lg" className="w-48">
              Explore Demo Mode
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wider">Detection Vectors</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Our models inspect digital integrity across visual, auditory, structural, and semantic layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} variant="glass" className="hover:border-cyber-cyan/30 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-5 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed flex-grow">{feat.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wider">How it Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Three simple phases to verify the authenticity of any visual asset or message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start gap-4">
              <span className="text-5xl font-black text-cyber-cyan/10 select-none leading-none absolute -top-8 -left-2">
                {step.step}
              </span>
              <h3 className="text-lg font-semibold text-white z-10">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Panel */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto px-6 md:px-12 bg-slate-950/20 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-wider">
              Advanced Neural Verification
            </h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6">
              VeriShield AI aggregates modern advancements in generative adversary network (GAN) detection, NLP smishing pattern classification, and global domain threat telemetry. Our architecture isolates artifact signals at the pixel and sub-harmonic levels.
            </p>
            <div className="space-y-3">
              {[
                'Pixel-level noise density vector scans',
                'Deep-fake mouth landmark movement matching',
                'Acoustic vocoder phase irregularity mapping',
                'NLP urgent contextual trigger identification'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyber-cyan" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative border border-white/5 bg-slate-900/60 p-6 rounded-2xl glass-panel shadow-glow-blue/5 flex flex-col gap-4 overflow-hidden scanner-beam">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-xs font-mono text-cyan-400">MODEL SCAN RUNNING...</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">FILE: target_492.mov</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>Phase Shift Check:</span>
                <span className="text-red-400">96.8% MATCH (SYNTHETIC)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded">
                <div className="bg-red-500 h-1.5 rounded" style={{ width: '96.8%' }} />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span>Facial Noise Distribution:</span>
                <span className="text-red-400">94.1% DEEPFAKE MARKER</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded">
                <div className="bg-red-500 h-1.5 rounded" style={{ width: '94.1%' }} />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span>Natural Audio Cadence:</span>
                <span className="text-green-400">12% SPEAR-VOICE ANOMALY</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded">
                <div className="bg-green-500 h-1.5 rounded" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wider">SecOps Endorsements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="glass" className="border-l-4 border-cyber-cyan">
            <CardContent className="p-6">
              <p className="text-xs italic text-gray-300 mb-4">
                "Our security response team uses VeriShield AI daily. The accuracy rate on synthesized CEO audio instructions is second to none. We blocked two major financial routing spear-attacks."
              </p>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-cyber-cyan" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sarah Jenkins</h4>
                  <span className="text-[10px] text-gray-500">VP Security Operations, Apex Global</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="glass" className="border-l-4 border-cyber-blue">
            <CardContent className="p-6">
              <p className="text-xs italic text-gray-300 mb-4">
                "Phishing links mimic bank sites with extreme fidelity. The DNS and homoglyph scanner catches threats minutes after register, keeping our employee mail boxes secure."
              </p>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-cyber-blue" />
                <div>
                  <h4 className="text-xs font-bold text-white">David Miller</h4>
                  <span className="text-[10px] text-gray-500">Director of Cyber Defence, InfiniSec</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-white/5 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-white/5 pb-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-cyber-cyan" />
                {faq.q}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyber-cyan" />
            <span className="font-bold text-white tracking-widest text-sm">VERISHIELD AI</span>
          </div>
          <p className="text-[11px] text-gray-500">
            &copy; 2026 VeriShield AI Security. All rights reserved. Consolidated protection for modern digital workspaces.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
