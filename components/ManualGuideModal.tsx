import React from 'react';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  Volume2, 
  Cpu, 
  Move3d, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Monitor,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface ManualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  darkMode: boolean;
}

export const ManualGuideModal: React.FC<ManualGuideModalProps> = ({
  isOpen,
  onClose,
  onStartTour,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        id="manual-guide-dialog"
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all backdrop-blur-2xl ${
          darkMode 
            ? 'bg-[#10131e]/90 border-white/15 text-white shadow-blue-500/10' 
            : 'bg-white/95 border-black/10 text-zinc-900 shadow-xl'
        }`}
      >
        {/* Header with Liquid Glass accent */}
        <div className="relative px-6 py-5 flex items-center justify-between border-b border-white/10 overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-72 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight">
                  Spatial Sound Controller — User Manual & Setup Guide
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete guide to Windows audio routing, Dolby Atmos 7.1.4 virtualizer, and auto-tuning.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Quick Guided Tour Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/20 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-100">
                  First Time Here? Take the Interactive Tour
                </h4>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Follow a 6-step guided walkthrough highlighting all spatial controls and auto-calibration.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onStartTour();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>Start Interactive Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: How to Spatialise Windows System Audio */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              1. Routing All Windows Output Audio into Spatial Sound
            </h4>
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2.5 ${
              darkMode ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
              <p>
                To enable 7.1.4 spatial audio for all your Windows apps (games, Spotify, Netflix, YouTube, or system sounds):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-blue-400 block mb-1">Step 1: Turn ON</span>
                  <span>Toggle the master switch labeled <strong>"Windows Output Spatial Sound"</strong> on the top right.</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-indigo-400 block mb-1">Step 2: Connect Stream</span>
                  <span>Click <strong>"Capture System Audio"</strong> and select Entire Screen or Window with audio enabled.</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-emerald-400 block mb-1">Step 3: Auto-Tune</span>
                  <span>Click the <strong>"Auto-Adjust"</strong> button to calibrate acoustics for your detected headphones or speakers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Auto-Detection & Adjustment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              2. Automatic Hardware Device Detection & Adjustment
            </h4>
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              darkMode ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
              <p>
                The app automatically fetches your connected audio hardware endpoint (e.g. AirPods Pro, Sony WH-1000XM, Realtek High Definition Audio, USB DACs, or HDMI Surround systems).
              </p>
              <p>
                When you click <strong>"Auto-Adjust Spatial Sound"</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong className="text-zinc-200">Headphones:</strong> Applies individual HRTF pinna elevation filters, 125% wide soundstage, and zero-crosstalk binaural rendering.</li>
                <li><strong className="text-zinc-200">Speakers:</strong> Implements room acoustic crosstalk cancellation and Dialogue Clarity boost.</li>
                <li><strong className="text-zinc-200">Bluetooth:</strong> Compensates for wireless codec buffer jitter with adaptive dynamic level smoothing.</li>
                <li><strong className="text-zinc-200">USB DAC / Studio:</strong> Switches to 96kHz bit-perfect low-latency WASAPI/ASIO monitoring.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Dolby Atmos 7.1.4 Immersion Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              3. Dolby Atmos Immersion Engine
            </h4>
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              darkMode ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-semibold text-blue-300 block mb-0.5">Dolby Dialogue Enhancer</span>
                  <span className="text-zinc-400 text-[11px]">
                    Isolates and elevates speech frequencies (1.5kHz - 3.2kHz) in movies and voice chat without raising overall volume.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-semibold text-amber-300 block mb-0.5">Bass Management & LFE</span>
                  <span className="text-zinc-400 text-[11px]">
                    Sub-harmonic exciter that directs deep low-frequency effects (30Hz - 90Hz) cleanly to the virtual subwoofer.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-semibold text-emerald-300 block mb-0.5">Dolby Volume Leveler</span>
                  <span className="text-zinc-400 text-[11px]">
                    Multi-band dynamic range compressor eliminating sudden jarring volume spikes while keeping whispers audible.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-semibold text-indigo-300 block mb-0.5">7.1.4 Height Speakers</span>
                  <span className="text-zinc-400 text-[11px]">
                    4 overhead height channels (Top Front L/R, Top Rear L/R) for realistic vertical sound placement (aircraft, rain, ambient atmosphere).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Driver Compatibility Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              4. Audio Driver Compatibility & Low Latency
            </h4>
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              darkMode ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}>
              <p>
                The controller integrates natively with all major Windows audio driver subsystems:
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">Dolby Atmos UWP</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">Windows Sonic</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">Realtek WASAPI Exclusive</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">ASIO Studio 64-sample</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">Bluetooth LE LC3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready for Windows 10 & 11 Audio Endpoints</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
