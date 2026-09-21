import React from 'react';
import { 
  Sparkles, 
  Film, 
  Gamepad2, 
  Music2, 
  Mic2, 
  SlidersHorizontal,
  Volume2,
  CheckCircle2,
  Zap,
  Ear,
  Layers
} from 'lucide-react';
import { SoundProfile, SpatialAudioSettings } from '../types';

interface DolbyControlPanelProps {
  darkMode: boolean;
  settings: SpatialAudioSettings;
  onUpdateSettings: (newSettings: Partial<SpatialAudioSettings>) => void;
  onSelectProfile: (profile: SoundProfile) => void;
}

export const DolbyControlPanel: React.FC<DolbyControlPanelProps> = ({
  darkMode,
  settings,
  onUpdateSettings,
  onSelectProfile
}) => {
  const profiles: { id: SoundProfile; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'cinema', label: 'Cinema', icon: <Film className="w-4 h-4" />, desc: 'Dolby Atmos cinematic immersion with deep bass & crisp dialog' },
    { id: 'gaming', label: 'Gaming 360', icon: <Gamepad2 className="w-4 h-4" />, desc: 'Positional footstep clarity and tactical 3D surround sound' },
    { id: 'music', label: 'Concert Hall', icon: <Music2 className="w-4 h-4" />, desc: 'Wide natural acoustic soundstage with high spatial fidelity' },
    { id: 'podcast', label: 'Voice & Comm', icon: <Mic2 className="w-4 h-4" />, desc: 'Voice separation, noise floor reduction and center focus' },
    { id: 'custom', label: 'Custom Pro', icon: <SlidersHorizontal className="w-4 h-4" />, desc: 'Manual parameter control over all spatial acoustics' },
  ];

  return (
    <div 
      id="dolby-control-panel"
      className={`relative p-5 rounded-2xl border backdrop-blur-2xl transition-all overflow-hidden ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 shadow-2xl' 
          : 'bg-white/80 border-black/10 shadow-lg'
      }`}
    >
      {/* Specular glass reflection line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {/* Master Global Spatial Audio Card */}
      <div className={`p-4 rounded-xl border transition-all mb-5 ${
        settings.globalSpatialEnabled
          ? 'bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-950/40 border-blue-500/40 shadow-md shadow-blue-500/10'
          : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/80 border-zinc-200'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl transition-all ${
              settings.globalSpatialEnabled
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-zinc-700 text-zinc-400'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white dark:text-white">
                  Windows Output Spatial Sound
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  settings.globalSpatialEnabled 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-zinc-700 text-zinc-300'
                }`}>
                  {settings.globalSpatialEnabled ? 'Active' : 'Bypassed'}
                </span>
              </div>
              <p className="text-xs text-zinc-300 dark:text-zinc-400 mt-1 max-w-md leading-relaxed">
                When enabled, all Windows applications, games, and web media output audio are converted in real-time into 7.1.4 Dolby Atmos spatial audio.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              id="global-spatial-switch-btn"
              onClick={() => onUpdateSettings({ globalSpatialEnabled: !settings.globalSpatialEnabled })}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.globalSpatialEnabled ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.globalSpatialEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[11px] font-medium text-zinc-400">
              {settings.globalSpatialEnabled ? 'Turn OFF' : 'Turn ON'}
            </span>
          </div>
        </div>

        {/* Quick Dolby Atmos Status Strip */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10 text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Dolby Atmos 7.1.4 Virtualizer</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Ear className="w-3.5 h-3.5 text-indigo-400" />
            <span>HRTF Binaural Rendering</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>All Audio Drivers Compatible</span>
          </div>
        </div>
      </div>

      {/* Sound Profiles (Apple Segmented Picker style) */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-zinc-300 dark:text-zinc-400 block mb-2 uppercase tracking-wider">
          Immersion Sound Profile
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {profiles.map(p => {
            const isSelected = settings.profile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : darkMode
                      ? 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 border-white/5'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1.5 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-blue-400'
                }`}>
                  {p.icon}
                </div>
                <span className="text-xs font-semibold">{p.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-zinc-400 mt-2 italic">
          {profiles.find(p => p.id === settings.profile)?.desc}
        </p>
      </div>

      {/* Dolby Audio Processing Suite Sliders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Dolby Advanced Processing Suite
          </h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-zinc-400">Dolby Enhancements</span>
            <input 
              type="checkbox"
              checked={settings.dolbyImmersionEnabled}
              onChange={(e) => onUpdateSettings({ dolbyImmersionEnabled: e.target.checked })}
              className="accent-blue-500 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* 1. Dolby Dialogue Enhancer */}
        <div className={`p-3 rounded-xl border transition-all ${
          settings.dolbyImmersionEnabled 
            ? darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'
            : 'opacity-50 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-200">Dolby Dialogue Enhancer</span>
            <span className="font-mono text-blue-400 font-semibold">{settings.dolbyDialogueEnhancer}%</span>
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={settings.dolbyDialogueEnhancer}
            onChange={(e) => onUpdateSettings({ dolbyDialogueEnhancer: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Isolates and clarifies center-channel speech frequencies against loud movie explosions and gaming sounds.
          </p>
        </div>

        {/* 2. Dolby Bass Management & Subwoofer Exciter */}
        <div className={`p-3 rounded-xl border transition-all ${
          settings.dolbyImmersionEnabled 
            ? darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'
            : 'opacity-50 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-200">Dolby Bass Management & Subwoofer Exciter</span>
            <span className="font-mono text-amber-400 font-semibold">{settings.dolbyBassManagement}%</span>
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={settings.dolbyBassManagement}
            onChange={(e) => onUpdateSettings({ dolbyBassManagement: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-amber-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Harmonic sub-bass synthesizer routing low-frequency effects cleanly to the virtual LFE channel without distortion.
          </p>
        </div>

        {/* 3. Dolby Volume Leveler */}
        <div className={`p-3 rounded-xl border transition-all ${
          settings.dolbyImmersionEnabled 
            ? darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'
            : 'opacity-50 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-200">Dolby Volume Leveler (Dynamic Range Control)</span>
            <span className="font-mono text-emerald-400 font-semibold">{settings.dolbyVolumeLeveler}%</span>
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={settings.dolbyVolumeLeveler}
            onChange={(e) => onUpdateSettings({ dolbyVolumeLeveler: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-emerald-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Normalizes sudden volume spikes across apps, keeping whispering quiet parts clearly audible.
          </p>
        </div>

        {/* 4. Soundstage Width & Surround Virtualizer */}
        <div className={`p-3 rounded-xl border transition-all ${
          darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-zinc-200">Surround Soundstage Expansion</span>
            <span className="font-mono text-indigo-400 font-semibold">{settings.soundstageWidth}%</span>
          </div>
          <input 
            type="range"
            min="50"
            max="200"
            value={settings.soundstageWidth}
            onChange={(e) => onUpdateSettings({ soundstageWidth: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>50% (Intimate)</span>
            <span>100% (Standard 7.1.4)</span>
            <span>200% (Ultra-Wide Arena)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
