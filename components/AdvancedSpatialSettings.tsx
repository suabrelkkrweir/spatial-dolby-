import React from 'react';
import { 
  Building2, 
  Ear, 
  Sliders, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  RotateCcw,
  Check,
  ShieldAlert
} from 'lucide-react';
import { HRTFProfile, RoomMaterial, SpatialAudioSettings } from '../types';
import { audioEngine } from '../services/audioEngine';

interface AdvancedSpatialSettingsProps {
  darkMode: boolean;
  settings: SpatialAudioSettings;
  onUpdateSettings: (newSettings: Partial<SpatialAudioSettings>) => void;
  onResetDefaults: () => void;
}

export const AdvancedSpatialSettings: React.FC<AdvancedSpatialSettingsProps> = ({
  darkMode,
  settings,
  onUpdateSettings,
  onResetDefaults
}) => {
  const roomSizes: { id: SpatialAudioSettings['roomSize']; label: string; decay: number }[] = [
    { id: 'small', label: 'Small Studio (15m²)', decay: 0.8 },
    { id: 'medium', label: 'Medium Cinema (80m²)', decay: 1.6 },
    { id: 'large', label: 'Concert Hall (300m²)', decay: 2.4 },
    { id: 'cathedral', label: 'Cathedral / Arena (1200m²)', decay: 3.5 },
  ];

  const materials: { id: RoomMaterial; label: string; desc: string }[] = [
    { id: 'wood_panel', label: 'Natural Wood Panels', desc: 'Warm resonance & balanced reflections' },
    { id: 'acoustic_foam', label: 'Studio Acoustic Foam', desc: 'High absorption, tight spatial imaging' },
    { id: 'velvet_drapes', label: 'Cinema Velvet Drapes', desc: 'Soft high damping for movie dialogue' },
    { id: 'concrete', label: 'Polished Concrete', desc: 'Bright specular reflections with long tail' },
    { id: 'glass_studio', label: 'Modern Glass Studio', desc: 'Crisp transients with airy height shimmer' },
  ];

  const hrtfProfiles: { id: HRTFProfile; label: string; desc: string }[] = [
    { id: 'reference_neutral', label: 'Reference Neutral (CIPIC)', desc: 'Standard clinical HRTF curve optimized for 95% of listener ear shapes' },
    { id: 'wide_pinna', label: 'Extended Pinna Width', desc: 'Exaggerated inter-aural distance for maximum soundstage separation' },
    { id: 'deep_immersion', label: 'Deep Dolby Immersion', desc: 'Enhanced elevation notch filtering for overhead Atmos height channels' },
    { id: 'intimate_studio', label: 'Intimate Nearfield', desc: 'Ultra-close binaural localization for esports & gaming tracking' },
  ];

  const handleMaterialChange = (mat: RoomMaterial) => {
    onUpdateSettings({ roomMaterial: mat });
    audioEngine.generateRoomImpulse(settings.roomSize, settings.reverbDecayTime, mat);
  };

  const handleRoomSizeChange = (size: SpatialAudioSettings['roomSize'], decay: number) => {
    onUpdateSettings({ roomSize: size, reverbDecayTime: decay });
    audioEngine.generateRoomImpulse(size, decay, settings.roomMaterial);
  };

  return (
    <div 
      id="spatial-advanced-settings-panel"
      className={`relative p-6 rounded-2xl border backdrop-blur-2xl transition-all overflow-hidden ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 shadow-2xl' 
          : 'bg-white/80 border-black/10 shadow-lg'
      }`}
    >
      {/* Specular glass reflection line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-base tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-500" />
            Spatial Audio Advanced Calibration
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Fine-tune physical room acoustics, binaural HRTF ear models, and discrete channel gains.
          </p>
        </div>
        <button
          onClick={onResetDefaults}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            darkMode 
              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/10' 
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Acoustics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Room Acoustics & Impulse Convolver */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Acoustic Environment & Impulse Response
            </h4>
          </div>

          {/* Room Size Selector */}
          <div>
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              Virtual Room Volume
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roomSizes.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoomSizeChange(r.id, r.decay)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.roomSize === r.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : darkMode
                        ? 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border-white/5'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                  }`}
                >
                  <span className="text-xs font-semibold block">{r.label}</span>
                  <span className="text-[10px] text-zinc-300 opacity-80 block mt-0.5">
                    RT60: {r.decay}s
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wall Material */}
          <div>
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              Acoustic Wall Absorption & Material
            </label>
            <div className="space-y-1.5">
              {materials.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleMaterialChange(m.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    settings.roomMaterial === m.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : darkMode
                        ? 'bg-zinc-900/40 hover:bg-zinc-800/60 border-white/5 text-zinc-400'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block text-zinc-200">{m.label}</span>
                    <span className="text-[10px] text-zinc-400">{m.desc}</span>
                  </div>
                  {settings.roomMaterial === m.id && (
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reverb Decay Time RT60 */}
          <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Reverb Decay Time (RT60)</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.reverbDecayTime.toFixed(1)}s</span>
            </div>
            <input 
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={settings.reverbDecayTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateSettings({ reverbDecayTime: val });
                audioEngine.generateRoomImpulse(settings.roomSize, val, settings.roomMaterial);
              }}
              className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Early Reflections Mix */}
          <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Early Reflections Wet Mix</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.earlyReflectionsMix}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={settings.earlyReflectionsMix}
              onChange={(e) => onUpdateSettings({ earlyReflectionsMix: parseInt(e.target.value) })}
              className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: HRTF & Anatomical Ear Tuning */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Ear className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Binaural HRTF & Ear Physiology
            </h4>
          </div>

          {/* HRTF Profile Selector */}
          <div>
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              HRTF Mathematical Profile
            </label>
            <div className="space-y-1.5">
              {hrtfProfiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => onUpdateSettings({ hrtfProfile: p.id })}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    settings.hrtfProfile === p.id
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300'
                      : darkMode
                        ? 'bg-zinc-900/40 hover:bg-zinc-800/60 border-white/5 text-zinc-400'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block text-zinc-200">{p.label}</span>
                    <span className="text-[10px] text-zinc-400">{p.desc}</span>
                  </div>
                  {settings.hrtfProfile === p.id && (
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Head Circumference (influences ITD delay) */}
          <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div>
                <span className="font-medium text-zinc-200 block">Cranial Head Circumference</span>
                <span className="text-[10px] text-zinc-400">Calibrates Inter-Aural Time Delay (ITD)</span>
              </div>
              <span className="font-mono text-indigo-400 font-semibold">{settings.headCircumferenceCm} cm</span>
            </div>
            <input 
              type="range"
              min="50"
              max="64"
              value={settings.headCircumferenceCm}
              onChange={(e) => onUpdateSettings({ headCircumferenceCm: parseInt(e.target.value) })}
              className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>50cm (Compact)</span>
              <span>57cm (Average)</span>
              <span>64cm (Wide)</span>
            </div>
          </div>

          {/* Discrete 7.1.4 Channel Level Trims */}
          <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <h5 className="text-xs font-semibold text-zinc-200 mb-3 flex items-center justify-between">
              <span>7.1.4 Discrete Channel Gain Trims</span>
              <span className="text-[10px] text-zinc-400 font-normal">dB Calibration</span>
            </h5>

            <div className="space-y-3 text-xs">
              {/* Center Channel Focus */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">Center Channel Focus (Voice)</span>
                  <span className="font-mono text-blue-400 font-semibold">{settings.centerChannelFocus}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={settings.centerChannelFocus}
                  onChange={(e) => onUpdateSettings({ centerChannelFocus: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
                />
              </div>

              {/* LFE Subwoofer Level */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">LFE Subwoofer Level</span>
                  <span className="font-mono text-amber-400 font-semibold">{settings.lfeSubwooferLevel > 0 ? `+${settings.lfeSubwooferLevel}` : settings.lfeSubwooferLevel} dB</span>
                </div>
                <input 
                  type="range"
                  min="-12"
                  max="12"
                  value={settings.lfeSubwooferLevel}
                  onChange={(e) => onUpdateSettings({ lfeSubwooferLevel: parseInt(e.target.value) })}
                  className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Height Channels Elevation Balance */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">Top Height Channels (Dolby Atmos)</span>
                  <span className="font-mono text-emerald-400 font-semibold">{Math.round((settings.elevationDepth + 1) * 50)}%</span>
                </div>
                <input 
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.1"
                  value={settings.elevationDepth}
                  onChange={(e) => onUpdateSettings({ elevationDepth: parseFloat(e.target.value) })}
                  className="w-full h-1.5 rounded-lg appearance-none bg-zinc-700 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
