import React from 'react';
import { 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Moon, 
  Sun, 
  Cpu, 
  Radio, 
  BookOpen, 
  Compass, 
  Zap, 
  Power, 
  Minimize2,
  Maximize2,
  Layers
} from 'lucide-react';
import { AudioDriver } from '../types';

interface TitleBarProps {
  currentDriver: AudioDriver;
  globalSpatialEnabled: boolean;
  onToggleGlobalSpatial: () => void;
  onOpenDriverModal: () => void;
  onOpenManualGuide: () => void;
  onStartTour: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  latencyMs: number;
  activeInputMode: string;
  isMiniView: boolean;
  onToggleMiniView: () => void;
  lowResourceMode: boolean;
  onToggleLowResource: () => void;
  onOpenStartupModal: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentDriver,
  globalSpatialEnabled,
  onToggleGlobalSpatial,
  onOpenDriverModal,
  onOpenManualGuide,
  onStartTour,
  darkMode,
  onToggleDarkMode,
  latencyMs,
  activeInputMode,
  isMiniView,
  onToggleMiniView,
  lowResourceMode,
  onToggleLowResource,
  onOpenStartupModal
}) => {
  return (
    <header 
      id="app-titlebar"
      className={`relative px-4 py-2.5 flex items-center justify-between border-b backdrop-blur-2xl transition-colors duration-300 z-30 ${
        darkMode 
          ? 'bg-[#10131e]/70 border-white/15 text-white' 
          : 'bg-white/80 border-black/10 text-zinc-900 shadow-xs'
      }`}
    >
      {/* Specular glass highlight line at the top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Left: Window Dots & App Brand */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Apple macOS style window dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 hover:brightness-110 cursor-pointer transition-all shadow-2xs" />
          <div 
            onClick={onToggleMiniView}
            title="Mini Controller / PiP View"
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 hover:brightness-110 cursor-pointer transition-all shadow-2xs" 
          />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 hover:brightness-110 cursor-pointer transition-all shadow-2xs" />
        </div>

        <div className="h-4 w-[1px] bg-white/10 dark:bg-white/10" />

        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            globalSpatialEnabled
              ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-blue-500/25'
              : darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
          }`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Spatial Sound Controller
              </span>
              <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase transition-colors ${
                globalSpatialEnabled 
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                  : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
              }`}>
                {globalSpatialEnabled ? 'Spatial 7.1.4' : 'Stereo Direct'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Audio Driver, Manual, & Tour */}
      <div className="hidden xl:flex items-center gap-2">
        <button
          id="driver-selector-btn"
          onClick={onOpenDriverModal}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            darkMode 
              ? 'bg-zinc-900/80 border-white/10 hover:border-blue-500/40 text-zinc-200 hover:bg-zinc-800/80' 
              : 'bg-zinc-100 border-zinc-200 hover:border-blue-400 text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Click to change audio driver and buffer configuration"
        >
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="max-w-[150px] truncate">{currentDriver.name}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 font-mono">
            {currentDriver.sampleRate / 1000}kHz
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {latencyMs.toFixed(1)}ms
          </span>
          <Sliders className="w-3 h-3 text-zinc-400 group-hover:text-blue-400 transition-colors ml-0.5" />
        </button>

        {/* Top Manual Guide Button */}
        <button
          id="top-manual-guide-btn"
          onClick={onOpenManualGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-all shadow-xs"
          title="Open complete User Manual & Windows Audio Guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Manual Guide</span>
        </button>

        {/* Top Tour Button */}
        <button
          id="top-tour-btn"
          onClick={onStartTour}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-medium text-blue-300 transition-all shadow-xs"
          title="Start interactive guided tour"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Tour</span>
        </button>
      </div>

      {/* Right Controls: Mini View / PiP, Eco Mode, Startup, Spatial Toggle, Theme */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Eco / Low Resource Mode Toggle Pill */}
        <button
          onClick={onToggleLowResource}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
            lowResourceMode
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={lowResourceMode ? 'Low-Resource Mode Active (0.3% CPU)' : 'Click to enable Low CPU & RAM Mode'}
        >
          <Zap className={`w-3.5 h-3.5 ${lowResourceMode ? 'text-emerald-400' : 'text-zinc-400'}`} />
          <span className="hidden sm:inline font-mono text-[11px]">
            {lowResourceMode ? 'Eco: 0.3% CPU' : 'Eco Mode'}
          </span>
        </button>

        {/* Mini Controller / PiP View Toggle */}
        <button
          id="mini-pip-toggle-btn"
          onClick={onToggleMiniView}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
            isMiniView
              ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
              : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to Mini Controller / PiP floating widget"
        >
          <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Mini / PiP</span>
        </button>

        {/* Windows Startup & Auto-Run Button */}
        <button
          id="startup-settings-btn"
          onClick={onOpenStartupModal}
          className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
          title="Windows Auto-Run at Startup settings"
        >
          <Power className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden lg:inline text-[11px]">Auto-Run</span>
        </button>

        {/* Master Spatial Switch */}
        <div className="flex items-center gap-2 pl-1 border-l border-white/10">
          <span className="text-xs font-medium text-zinc-400 hidden xl:inline">
            Spatial Engine
          </span>
          <button
            id="master-spatial-quick-toggle"
            onClick={onToggleGlobalSpatial}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              globalSpatialEnabled ? 'bg-blue-600' : darkMode ? 'bg-zinc-700' : 'bg-zinc-300'
            }`}
            aria-pressed={globalSpatialEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                globalSpatialEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleDarkMode}
          className={`p-1.5 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-white/10 text-zinc-400 hover:text-zinc-200' 
              : 'hover:bg-black/5 text-zinc-600 hover:text-zinc-900'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
