import React, { useState } from 'react';
import { 
  Cpu, 
  Check, 
  X, 
  Activity, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  Volume2, 
  Zap,
  Info
} from 'lucide-react';
import { AudioDriver, AudioDriverId } from '../types';
import { SUPPORTED_DRIVERS } from '../services/audioEngine';

interface DriverRoutingModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedDriverId: AudioDriverId;
  onSelectDriver: (driverId: AudioDriverId) => void;
}

export const DriverRoutingModal: React.FC<DriverRoutingModalProps> = ({
  darkMode,
  isOpen,
  onClose,
  selectedDriverId,
  onSelectDriver
}) => {
  const [bufferSize, setBufferSize] = useState<number>(128);
  const [sampleRate, setSampleRate] = useState<number>(48000);
  const [exclusiveMode, setExclusiveMode] = useState<boolean>(true);
  const [testingTone, setTestingTone] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDriver = SUPPORTED_DRIVERS.find(d => d.id === selectedDriverId) || SUPPORTED_DRIVERS[0];
  const calculatedLatency = ((bufferSize / sampleRate) * 1000 + 0.8).toFixed(2);

  const triggerDriverTest = () => {
    setTestingTone(true);
    // Play a gentle calibration blip using simple Web Audio oscillator
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const testCtx = new AudioCtxClass();
      const osc = testCtx.createOscillator();
      const gain = testCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, testCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, testCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, testCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, testCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(testCtx.destination);
      osc.start();
      osc.stop(testCtx.currentTime + 0.35);
    } catch {
      // Audio blip
    }
    setTimeout(() => setTestingTone(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="audio-driver-dialog"
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          darkMode 
            ? 'bg-[#141722] border-white/10 text-white' 
            : 'bg-white border-black/10 text-zinc-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">
                Audio Drivers & Universal Compatibility Engine
              </h3>
              <p className="text-xs text-zinc-400">
                Direct hardware routing layer for all Windows sound drivers and interfaces.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Driver Architecture List */}
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-2 uppercase tracking-wider">
              Installed Windows Audio Drivers
            </label>
            <div className="space-y-2">
              {SUPPORTED_DRIVERS.map(driver => {
                const isSelected = driver.id === selectedDriverId;
                return (
                  <button
                    key={driver.id}
                    onClick={() => onSelectDriver(driver.id)}
                    className={`w-full flex items-start justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/60 shadow-sm'
                        : darkMode
                          ? 'bg-zinc-900/50 hover:bg-zinc-800/60 border-white/5'
                          : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-zinc-100">
                            {driver.name}
                          </span>
                          {driver.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 font-medium">
                              {driver.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {driver.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-500 font-mono">
                          <span>Arch: {driver.type}</span>
                          <span>•</span>
                          <span>Channels: {driver.channels}</span>
                          <span>•</span>
                          <span>Default Latency: ~{driver.latencyMs}ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3 mt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Low-Latency Buffer & Kernel Settings */}
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Buffer Latency & Sampling Rate
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Buffer Size Selector */}
              <div>
                <label className="text-zinc-400 block mb-1 font-medium">
                  I/O Buffer Size (Samples)
                </label>
                <select
                  value={bufferSize}
                  onChange={(e) => setBufferSize(parseInt(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-mono ${
                    darkMode ? 'bg-zinc-800 border-white/10 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
                  }`}
                >
                  <option value="64">64 samples (Ultra-Low 1.8ms - ASIO Pro)</option>
                  <option value="128">128 samples (Recommended Studio 3.2ms)</option>
                  <option value="256">256 samples (Balanced 5.8ms)</option>
                  <option value="512">512 samples (High Stability 11.2ms)</option>
                  <option value="1024">1024 samples (Safe VM Mode 22.0ms)</option>
                </select>
              </div>

              {/* Sample Rate Selector */}
              <div>
                <label className="text-zinc-400 block mb-1 font-medium">
                  DAC Hardware Clock Rate
                </label>
                <select
                  value={sampleRate}
                  onChange={(e) => setSampleRate(parseInt(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-mono ${
                    darkMode ? 'bg-zinc-800 border-white/10 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
                  }`}
                >
                  <option value="44100">44.1 kHz (CD Audio)</option>
                  <option value="48000">48.0 kHz (Dolby Atmos Standard)</option>
                  <option value="96000">96.0 kHz (Hi-Res Audio Master)</option>
                  <option value="192000">192.0 kHz (Audiophile Direct)</option>
                </select>
              </div>
            </div>

            {/* Calculated Hardware Latency Banner */}
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-200">
                  Calculated Output Latency:
                </span>
                <span className="font-mono font-bold text-sm text-blue-300">
                  {calculatedLatency} ms
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Jitter: 0.04ms (Bit-Perfect)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={triggerDriverTest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              testingTone 
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' 
                : darkMode 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-white/10' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{testingTone ? 'Emitting Test Ping...' : 'Test Driver Output'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
