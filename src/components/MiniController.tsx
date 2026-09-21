import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Maximize2, 
  Power, 
  Cpu, 
  Zap, 
  Check, 
  Headphones, 
  Speaker, 
  Bluetooth, 
  Tv, 
  Move3d, 
  CheckCircle2,
  Sliders,
  Pin
} from 'lucide-react';
import { SoundProfile, SpatialAudioSettings, DeviceCategory } from '../types';
import { audioEngine } from '../services/audioEngine';

interface MiniControllerProps {
  darkMode: boolean;
  settings: SpatialAudioSettings;
  onUpdateSettings: (partial: Partial<SpatialAudioSettings>) => void;
  onExpandToFull: () => void;
  onAutoAdjust: () => void;
  activeDeviceLabel: string;
  activeDeviceCategory?: DeviceCategory;
  lowResourceMode: boolean;
  onToggleLowResource: () => void;
  isAudioPlaying: boolean;
  onSelectProfile: (profile: SoundProfile) => void;
}

export const MiniController: React.FC<MiniControllerProps> = ({
  darkMode,
  settings,
  onUpdateSettings,
  onExpandToFull,
  onAutoAdjust,
  activeDeviceLabel,
  activeDeviceCategory,
  lowResourceMode,
  onToggleLowResource,
  isAudioPlaying,
  onSelectProfile
}) => {
  const [isPinned, setIsPinned] = useState(true);
  const [miniCalibrated, setMiniCalibrated] = useState(false);

  const handleQuickCalibrate = () => {
    onAutoAdjust();
    setMiniCalibrated(true);
    setTimeout(() => setMiniCalibrated(false), 3000);
  };

  const getDeviceIcon = (cat?: DeviceCategory) => {
    switch (cat) {
      case 'headphones':
        return <Headphones className="w-3.5 h-3.5 text-blue-400" />;
      case 'bluetooth':
        return <Bluetooth className="w-3.5 h-3.5 text-sky-400" />;
      case 'speakers':
        return <Speaker className="w-3.5 h-3.5 text-indigo-400" />;
      case 'usb_dac':
        return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
      case 'hdmi_surround':
        return <Tv className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Headphones className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const profiles: { id: SoundProfile; label: string }[] = [
    { id: 'cinema', label: 'Cinema' },
    { id: 'gaming', label: 'Game' },
    { id: 'music', label: 'Music' },
    { id: 'podcast', label: 'Voice' }
  ];

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isPinned 
        ? 'bottom-6 right-6 w-80 sm:w-96 shadow-2xl' 
        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 shadow-2xl'
    }`}>
      <div 
        className={`relative rounded-3xl border backdrop-blur-3xl overflow-hidden p-4 transition-all ${
          darkMode 
            ? 'bg-[#0f1322]/95 border-white/20 text-white shadow-blue-500/20' 
            : 'bg-white/95 border-black/15 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Specular Liquid Glass Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Mini Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              settings.globalSpatialEnabled 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-zinc-800 text-zinc-500'
            }`}>
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-none tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Spatial Controller
              </h4>
              <span className="text-[9px] font-mono text-zinc-400">
                {settings.globalSpatialEnabled ? '7.1.4 Atmos' : '2.0 Stereo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Eco mode pill */}
            <button
              onClick={onToggleLowResource}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors ${
                lowResourceMode 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Low CPU & RAM Mode"
            >
              <Zap className="w-2.5 h-2.5" />
              <span>{lowResourceMode ? 'Eco: 0.2%' : 'Pro'}</span>
            </button>

            {/* Pin Toggle */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1 rounded-lg transition-colors ${
                isPinned ? 'text-blue-400 bg-blue-500/15' : 'text-zinc-400 hover:text-white'
              }`}
              title={isPinned ? 'Unpin from corner' : 'Pin to corner'}
            >
              <Pin className="w-3 h-3" />
            </button>

            {/* Expand button */}
            <button
              onClick={onExpandToFull}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Expand to Full Studio Window"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Master Spatial Switch Row */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              settings.globalSpatialEnabled ? 'bg-blue-400 animate-ping' : 'bg-zinc-600'
            }`} />
            <span className="text-xs font-semibold">
              {settings.globalSpatialEnabled ? 'Spatial Sound Active' : 'Spatial Audio Bypassed'}
            </span>
          </div>

          <button
            onClick={() => onUpdateSettings({ globalSpatialEnabled: !settings.globalSpatialEnabled })}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              settings.globalSpatialEnabled ? 'bg-blue-600' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                settings.globalSpatialEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Active Output Device & Auto-Adjust Button */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
              {getDeviceIcon(activeDeviceCategory)}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-400 font-mono block leading-none">Output Device</span>
              <span className="text-xs font-semibold truncate block text-zinc-200 mt-0.5">
                {activeDeviceLabel.split('(')[0].trim()}
              </span>
            </div>
          </div>

          <button
            onClick={handleQuickCalibrate}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-semibold text-[11px] shadow-sm shrink-0 cursor-pointer transition-all"
            title="Auto-tune spatial acoustics for this device"
          >
            {miniCalibrated ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>Tuned!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Auto-Adjust</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Selector Chips */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectProfile(p.id)}
              className={`py-1 rounded-lg text-[10px] font-bold tracking-tight text-center transition-all ${
                settings.profile === p.id 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Master Volume Slider */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white/[0.02]">
          <Volume2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input 
            type="range"
            min="0"
            max="100"
            value={settings.masterVolume}
            onChange={(e) => onUpdateSettings({ masterVolume: parseInt(e.target.value) })}
            className="w-full h-1 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
            {settings.masterVolume}%
          </span>
        </div>

        {/* Bottom Status bar */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
          <span>WASAPI 48kHz</span>
          <span>{isAudioPlaying ? 'Streaming Audio' : 'Idle'}</span>
          <button 
            onClick={onExpandToFull}
            className="text-blue-400 hover:underline"
          >
            Full Studio ↗
          </button>
        </div>
      </div>
    </div>
  );
};
