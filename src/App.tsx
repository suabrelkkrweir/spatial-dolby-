/**
 * Spatial Sound Controller
 * Apple-inspired spatial audio controller for Windows with Dolby Atmos integration,
 * 7.1.4 virtualizer, advanced acoustics, universal driver compatibility,
 * semi-translucent liquid glass UI, auto-device detection & calibration,
 * Windows startup auto-run options, low CPU/RAM mode, and Mini Controller / PiP view.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  SlidersHorizontal, 
  Move3d, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  BookOpen,
  Compass,
  Info,
  Power,
  Zap,
  Minimize2
} from 'lucide-react';
import { 
  AudioDriverId, 
  SoundProfile, 
  SpatialAudioSettings,
  StartupSettings,
  DeviceCategory
} from './types';
import { 
  audioEngine, 
  SUPPORTED_DRIVERS 
} from './services/audioEngine';
import { TitleBar } from './components/TitleBar';
import { SpatialRadar } from './components/SpatialRadar';
import { DolbyControlPanel } from './components/DolbyControlPanel';
import { AdvancedSpatialSettings } from './components/AdvancedSpatialSettings';
import { DriverRoutingModal } from './components/DriverRoutingModal';
import { SoundTestEngine } from './components/SoundTestEngine';
import { GraphicEqualizer } from './components/GraphicEqualizer';
import { AcousticSpectrumBar } from './components/AcousticSpectrumBar';
import { AutoDeviceBar } from './components/AutoDeviceBar';
import { ManualGuideModal } from './components/ManualGuideModal';
import { GuidedTour } from './components/GuidedTour';
import { MiniController } from './components/MiniController';
import { StartupSettingsModal } from './components/StartupSettingsModal';

const INITIAL_SETTINGS: SpatialAudioSettings = {
  globalSpatialEnabled: true,
  dolbyImmersionEnabled: true,
  headTrackingEnabled: true,
  binauralUpmixEnabled: true,
  profile: 'cinema',
  soundstageWidth: 125,
  elevationDepth: 0.35,
  centerChannelFocus: 70,
  lfeSubwooferLevel: 4,
  dolbyDialogueEnhancer: 65,
  dolbyBassManagement: 75,
  dolbyVolumeLeveler: 40,
  dolbySurroundVirtualizer: 85,
  roomSize: 'medium',
  roomMaterial: 'wood_panel',
  reverbDecayTime: 1.6,
  earlyReflectionsMix: 25,
  wallAbsorption: 45,
  hrtfProfile: 'reference_neutral',
  headCircumferenceCm: 57,
  earDistanceDelayMs: 0.45,
  highFreqPinnaNotch: true,
  listenerYaw: 0,
  listenerPitch: 0,
  selectedDriverId: 'dolby-atmos',
  masterVolume: 85
};

const DEFAULT_STARTUP_SETTINGS: StartupSettings = {
  autoRunAtStartup: true,
  startupMode: 'normal',
  startInLowResourceMode: false,
  autoCalibrateOnDeviceChange: true
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [settings, setSettings] = useState<SpatialAudioSettings>(INITIAL_SETTINGS);
  const [soundSource, setSoundSource] = useState({ x: 0, y: 0.8, z: 0.35 });
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [activeTab, setActiveTab] = useState<'soundstage' | 'advanced' | 'equalizer'>('soundstage');
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isManualGuideOpen, setIsManualGuideOpen] = useState(false);
  const [isStartupModalOpen, setIsStartupModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState<string>('none');
  const [calibrationBanner, setCalibrationBanner] = useState<string | null>(null);

  // Mini Controller / PiP state
  const [isMiniView, setIsMiniView] = useState(false);

  // Low CPU/RAM Optimization state
  const [lowResourceMode, setLowResourceMode] = useState(false);

  // Active Device tracking for Mini Controller
  const [activeDeviceName, setActiveDeviceName] = useState('Default Headphones');
  const [activeDeviceCategory, setActiveDeviceCategory] = useState<DeviceCategory>('headphones');

  // Startup Settings
  const [startupSettings, setStartupSettings] = useState<StartupSettings>(() => {
    try {
      const saved = localStorage.getItem('spatial_sound_startup_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_STARTUP_SETTINGS;
  });

  // Save startup settings on change
  const handleUpdateStartupSettings = (partial: Partial<StartupSettings>) => {
    setStartupSettings(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('spatial_sound_startup_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Toggle low resource mode
  const handleToggleLowResource = () => {
    const next = !lowResourceMode;
    setLowResourceMode(next);
    audioEngine.setLowResourceMode(next);
  };

  // Keyboard shortcut: Press 'm' to toggle mini view
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsMiniView(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Check first time guided tour on mount & startup preferences
  useEffect(() => {
    try {
      const seen = localStorage.getItem('spatial_controller_tour_completed');
      if (!seen) {
        setIsTourOpen(true);
      }
      if (startupSettings.startupMode === 'mini') {
        setIsMiniView(true);
      }
      if (startupSettings.startInLowResourceMode) {
        setLowResourceMode(true);
        audioEngine.setLowResourceMode(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    try {
      localStorage.setItem('spatial_controller_tour_completed', 'true');
    } catch {
      // ignore
    }
  };

  // Listen to engine state updates
  useEffect(() => {
    const unsub = audioEngine.subscribe(() => {
      setActiveInputMode(audioEngine.getActiveMode());
      const pos = audioEngine.getSoundSourcePosition();
      setSoundSource(pos);
      setIsOrbiting(audioEngine.getActiveMode() === 'demo-orbit');
    });
    return () => {
      unsub();
    };
  }, []);

  // Sync settings to DSP engine
  useEffect(() => {
    audioEngine.applySettings(settings);
  }, [settings]);

  const handleUpdateSettings = (partial: Partial<SpatialAudioSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const handleApplyCalibration = (calib: Partial<SpatialAudioSettings>, deviceName: string) => {
    setSettings(prev => ({ ...prev, ...calib }));
    setActiveDeviceName(deviceName);
    setCalibrationBanner(`Acoustic Profile tuned & optimized for ${deviceName}`);
    setTimeout(() => {
      setCalibrationBanner(null);
    }, 4500);
  };

  const handleSelectProfile = (profile: SoundProfile) => {
    let updates: Partial<SpatialAudioSettings> = { profile };
    if (profile === 'cinema') {
      updates = {
        ...updates,
        soundstageWidth: 130,
        dolbyDialogueEnhancer: 70,
        dolbyBassManagement: 80,
        dolbyVolumeLeveler: 45,
        elevationDepth: 0.4,
        reverbDecayTime: 1.8,
        roomSize: 'medium',
        roomMaterial: 'velvet_drapes'
      };
    } else if (profile === 'gaming') {
      updates = {
        ...updates,
        soundstageWidth: 110,
        dolbyDialogueEnhancer: 50,
        dolbyBassManagement: 60,
        dolbyVolumeLeveler: 20,
        elevationDepth: 0.6,
        reverbDecayTime: 0.8,
        roomSize: 'small',
        roomMaterial: 'acoustic_foam'
      };
    } else if (profile === 'music') {
      updates = {
        ...updates,
        soundstageWidth: 140,
        dolbyDialogueEnhancer: 30,
        dolbyBassManagement: 65,
        dolbyVolumeLeveler: 15,
        elevationDepth: 0.25,
        reverbDecayTime: 2.2,
        roomSize: 'large',
        roomMaterial: 'wood_panel'
      };
    } else if (profile === 'podcast') {
      updates = {
        ...updates,
        soundstageWidth: 80,
        dolbyDialogueEnhancer: 90,
        dolbyBassManagement: 25,
        dolbyVolumeLeveler: 70,
        elevationDepth: 0.0,
        reverbDecayTime: 0.4,
        roomSize: 'small',
        roomMaterial: 'acoustic_foam'
      };
    }
    handleUpdateSettings(updates);
  };

  const handleSoundSourceUpdate = (x: number, y: number, z: number) => {
    setSoundSource({ x, y, z });
    audioEngine.setSoundSource(x, y, z);
  };

  const handleToggleOrbit = () => {
    if (isOrbiting) {
      audioEngine.stopCurrentPlayback();
      setIsOrbiting(false);
      setActiveInputMode('none');
    } else {
      audioEngine.startOrbitDemo();
      setIsOrbiting(true);
      setActiveInputMode('demo-orbit');
    }
  };

  const handleResetDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    audioEngine.generateRoomImpulse('medium', 1.6, 'wood_panel');
  };

  const currentDriver = SUPPORTED_DRIVERS.find(d => d.id === settings.selectedDriverId) || SUPPORTED_DRIVERS[0];

  return (
    <div className={`relative min-h-screen font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-500 overflow-x-hidden ${
      darkMode ? 'bg-[#080a10] text-[#f1f2f6]' : 'bg-[#f0f2f7] text-zinc-900'
    }`}>
      {/* Semi-translucent Liquid Glass Ambient Mesh Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[20%] w-[650px] h-[650px] bg-blue-600/12 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Main Glass Window Container */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col shadow-2xl border-x border-white/10 backdrop-blur-3xl">
        
        {/* Title Bar & Status with Liquid Glass Header */}
        <TitleBar 
          currentDriver={currentDriver}
          globalSpatialEnabled={settings.globalSpatialEnabled}
          onToggleGlobalSpatial={() => handleUpdateSettings({ globalSpatialEnabled: !settings.globalSpatialEnabled })}
          onOpenDriverModal={() => setIsDriverModalOpen(true)}
          onOpenManualGuide={() => setIsManualGuideOpen(true)}
          onStartTour={() => setIsTourOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          latencyMs={currentDriver.latencyMs}
          activeInputMode={activeInputMode}
          isMiniView={isMiniView}
          onToggleMiniView={() => setIsMiniView(!isMiniView)}
          lowResourceMode={lowResourceMode}
          onToggleLowResource={handleToggleLowResource}
          onOpenStartupModal={() => setIsStartupModalOpen(true)}
        />

        {/* Global Master Banner */}
        {settings.globalSpatialEnabled ? (
          <div className="relative bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-sky-500/15 border-b border-white/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-xl">
            <div className="flex items-center gap-2 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="font-semibold tracking-wide">
                Spatial Audio Output Active
              </span>
              <span className="hidden sm:inline text-zinc-400">
                — All Windows application audio rendered with 7.1.4 Dolby Atmos binaural HRTF.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              {lowResourceMode && (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Zap className="w-3 h-3" />
                  Eco Mode (0.3% CPU)
                </span>
              )}
              <span>WASAPI 48kHz</span>
              <span>•</span>
              <span className="text-blue-300 font-semibold">{currentDriver.name}</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-xs text-amber-300 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Spatial Audio Bypassed — Audio is playing in raw 2.0 flat stereo.</span>
            </div>
            <button
              onClick={() => handleUpdateSettings({ globalSpatialEnabled: true })}
              className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-[11px] border border-amber-500/40 transition-colors"
            >
              Turn On Spatial Sound
            </button>
          </div>
        )}

        {/* Calibration Toast Notification Banner */}
        {calibrationBanner && (
          <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">{calibrationBanner}</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">Binaural HRTF Calibrated</span>
          </div>
        )}

        {/* Liquid Glass Body Container */}
        <div className="flex-1 px-4 sm:px-6 py-4 space-y-5">
          
          {/* Automatic Device Detection & Auto-Adjustment Bar with Visible Device List */}
          <AutoDeviceBar 
            darkMode={darkMode}
            onApplyCalibration={handleApplyCalibration}
            currentDriverName={currentDriver.name}
          />

          {/* Navigation Tabs (Apple Liquid Segmented Bar) */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-3">
            {/* Liquid Segmented Tab Buttons */}
            <div className={`inline-flex p-1 rounded-2xl border backdrop-blur-2xl ${
              darkMode ? 'bg-white/[0.04] border-white/15 shadow-lg' : 'bg-black/[0.04] border-black/10 shadow-sm'
            }`}>
              <button
                id="tab-soundstage-btn"
                onClick={() => setActiveTab('soundstage')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'soundstage'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Move3d className="w-4 h-4" />
                <span>Soundstage & Dolby Suite</span>
              </button>

              <button
                id="tab-advanced-btn"
                onClick={() => setActiveTab('advanced')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'advanced'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Spatial Advanced Settings</span>
              </button>

              <button
                id="tab-equalizer-btn"
                onClick={() => setActiveTab('equalizer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'equalizer'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>10-Band Equalizer</span>
              </button>
            </div>

            {/* Quick Master Volume Slider with Liquid Pill */}
            <div className={`flex items-center gap-3 px-3.5 py-1.5 rounded-2xl border backdrop-blur-2xl ${
              darkMode ? 'bg-white/[0.04] border-white/15' : 'bg-black/[0.04] border-black/10'
            }`}>
              <Volume2 className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Volume:</span>
              <input 
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) => handleUpdateSettings({ masterVolume: parseInt(e.target.value) })}
                className="w-28 sm:w-36 h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-zinc-300 w-8">{settings.masterVolume}%</span>
            </div>
          </div>

          {/* Tab Views */}
          <main className="space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === 'soundstage' && (
                <motion.div
                  key="tab-soundstage"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                >
                  {/* 3D Soundstage Radar (5 cols) */}
                  <div className="lg:col-span-5">
                    <SpatialRadar 
                      darkMode={darkMode}
                      soundSource={soundSource}
                      onUpdateSoundSource={handleSoundSourceUpdate}
                      listenerYaw={settings.listenerYaw}
                      onUpdateListenerYaw={(yaw) => handleUpdateSettings({ listenerYaw: yaw })}
                      isOrbiting={isOrbiting}
                      onToggleOrbit={handleToggleOrbit}
                      isAudioPlaying={activeInputMode !== 'none'}
                      globalSpatialEnabled={settings.globalSpatialEnabled}
                    />
                  </div>

                  {/* Dolby Control & Master Settings (7 cols) */}
                  <div className="lg:col-span-7">
                    <DolbyControlPanel 
                      darkMode={darkMode}
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      onSelectProfile={handleSelectProfile}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div
                  key="tab-advanced"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdvancedSpatialSettings 
                    darkMode={darkMode}
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                    onResetDefaults={handleResetDefaults}
                  />
                </motion.div>
              )}

              {activeTab === 'equalizer' && (
                <motion.div
                  key="tab-equalizer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <GraphicEqualizer 
                    darkMode={darkMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Audio Spectrum Analyzer & DSP Status with Low Resource optimization */}
            <AcousticSpectrumBar 
              darkMode={darkMode}
              globalSpatialEnabled={settings.globalSpatialEnabled}
              isAudioPlaying={activeInputMode !== 'none'}
              lowResourceMode={lowResourceMode}
            />

            {/* Sound Testing & Windows Capture Suite */}
            <SoundTestEngine 
              darkMode={darkMode}
              activeMode={activeInputMode}
              globalSpatialEnabled={settings.globalSpatialEnabled}
              onToggleGlobalSpatial={() => handleUpdateSettings({ globalSpatialEnabled: !settings.globalSpatialEnabled })}
              onModeChange={(mode) => setActiveInputMode(mode)}
            />
          </main>
        </div>

        {/* Liquid Glass Footer */}
        <footer className={`px-6 py-4 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-2xl ${
          darkMode ? 'border-white/10 bg-white/[0.02] text-zinc-500' : 'border-black/5 bg-black/[0.02] text-zinc-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Spatial Sound Controller for Windows</span>
            <span>•</span>
            <span>Dolby Atmos Object Virtualizer 7.1.4</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsStartupModalOpen(true)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-zinc-400"
            >
              <Power className="w-3.5 h-3.5 text-indigo-400" />
              <span>Startup & Auto-Run</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsManualGuideOpen(true)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-zinc-400"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>User Manual</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsDriverModalOpen(true)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-zinc-400"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Driver Matrix</span>
            </button>
            <span>•</span>
            <span className={lowResourceMode ? 'text-emerald-400' : 'text-zinc-400'}>
              {lowResourceMode ? '⚡ Eco: 0.3% CPU' : 'Ultra-Low Latency DSP'}
            </span>
          </div>
        </footer>
      </div>

      {/* Mini Controller / Floating PiP Widget View */}
      {isMiniView && (
        <MiniController 
          darkMode={darkMode}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onExpandToFull={() => setIsMiniView(false)}
          onAutoAdjust={() => handleApplyCalibration({ soundstageWidth: 125, dolbyDialogueEnhancer: 65, dolbyBassManagement: 70 }, activeDeviceName)}
          activeDeviceLabel={activeDeviceName}
          activeDeviceCategory={activeDeviceCategory}
          lowResourceMode={lowResourceMode}
          onToggleLowResource={handleToggleLowResource}
          isAudioPlaying={activeInputMode !== 'none'}
          onSelectProfile={handleSelectProfile}
        />
      )}

      {/* Driver & Routing Modal */}
      <DriverRoutingModal 
        darkMode={darkMode}
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        selectedDriverId={settings.selectedDriverId}
        onSelectDriver={(driverId: AudioDriverId) => handleUpdateSettings({ selectedDriverId: driverId })}
      />

      {/* Manual Guide Modal */}
      <ManualGuideModal 
        isOpen={isManualGuideOpen}
        onClose={() => setIsManualGuideOpen(false)}
        onStartTour={() => setIsTourOpen(true)}
        darkMode={darkMode}
      />

      {/* Windows Startup Settings & Auto-Run Modal */}
      <StartupSettingsModal 
        isOpen={isStartupModalOpen}
        onClose={() => setIsStartupModalOpen(false)}
        darkMode={darkMode}
        settings={startupSettings}
        onUpdateSettings={handleUpdateStartupSettings}
      />

      {/* Interactive Guided Tour */}
      <GuidedTour 
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        darkMode={darkMode}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
