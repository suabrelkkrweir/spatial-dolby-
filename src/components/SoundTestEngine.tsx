import React, { useRef, useState } from 'react';
import { 
  Radio, 
  Monitor, 
  Orbit, 
  Film, 
  Gamepad2, 
  CloudRain, 
  Upload, 
  Square, 
  Volume2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { AudioInputMode } from '../types';
import { audioEngine } from '../services/audioEngine';

interface SoundTestEngineProps {
  darkMode: boolean;
  activeMode: string;
  globalSpatialEnabled: boolean;
  onToggleGlobalSpatial: () => void;
  onModeChange: (mode: string) => void;
}

export const SoundTestEngine: React.FC<SoundTestEngineProps> = ({
  darkMode,
  activeMode,
  globalSpatialEnabled,
  onToggleGlobalSpatial,
  onModeChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // System audio capture
  const handleCaptureSystemAudio = async () => {
    setErrorMessage(null);
    setIsCapturing(true);
    try {
      await audioEngine.startSystemAudioCapture();
      onModeChange('system-screen');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Audio capture permission was denied or not selected.';
      setErrorMessage(msg);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleStartOrbit = async () => {
    setErrorMessage(null);
    await audioEngine.startOrbitDemo();
    onModeChange('demo-orbit');
  };

  const handleStartCinema = async () => {
    setErrorMessage(null);
    await audioEngine.startCinemaDemo();
    onModeChange('demo-cinema');
  };

  const handleStartGaming = async () => {
    setErrorMessage(null);
    await audioEngine.startGamingDemo();
    onModeChange('demo-gaming');
  };

  const handleStartNature = async () => {
    setErrorMessage(null);
    await audioEngine.startNatureDemo();
    onModeChange('demo-nature');
  };

  const handleStop = () => {
    audioEngine.stopCurrentPlayback();
    onModeChange('none');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    try {
      await audioEngine.playCustomAudioFile(file);
      onModeChange('user-file');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not play audio file.';
      setErrorMessage(msg);
    }
  };

  return (
    <div 
      id="sound-test-engine"
      className={`relative p-5 rounded-2xl border backdrop-blur-2xl transition-all overflow-hidden ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 shadow-2xl' 
          : 'bg-white/80 border-black/10 shadow-lg'
      }`}
    >
      {/* Specular glass reflection line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-sm tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-500" />
            Audio Source & Live Spatial Testing
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Capture Windows output audio or test spatial audio localization with 3D Atmos demos.
          </p>
        </div>

        {/* Live A/B Comparison Button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-zinc-400 hidden sm:inline">
            A/B Instant Compare:
          </span>
          <button
            id="ab-spatial-compare-btn"
            onClick={onToggleGlobalSpatial}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              globalSpatialEnabled
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-amber-600/90 text-white border-amber-500 shadow-md shadow-amber-500/20'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{globalSpatialEnabled ? 'Spatial 7.1.4 (Active)' : 'Direct 2.0 Stereo (Flat)'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Source Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Card 1: Windows System Output Capture */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'system-screen'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                Windows Output Audio
              </span>
            </div>
            {activeMode === 'system-screen' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono animate-pulse">
                CAPTURING
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Stream entire Windows PC audio, games, or browser tab through the spatializer.
          </p>
          {activeMode === 'system-screen' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Windows Capture
            </button>
          ) : (
            <button
              onClick={handleCaptureSystemAudio}
              disabled={isCapturing}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              {isCapturing ? 'Connecting...' : 'Capture System Audio'}
            </button>
          )}
        </div>

        {/* Card 2: 360° Orbiting Spatial Sound */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'demo-orbit'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Orbit className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                360° Spatial Orbit Test
              </span>
            </div>
            {activeMode === 'demo-orbit' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Continuous orbiting chime rotating 360° around your ears with height oscillation.
          </p>
          {activeMode === 'demo-orbit' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Orbit
            </button>
          ) : (
            <button
              onClick={handleStartOrbit}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play 360° Orbit
            </button>
          )}
        </div>

        {/* Card 3: Dolby Atmos Cinematic Trailer */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'demo-cinema'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                Dolby Atmos Cinema Demo
              </span>
            </div>
            {activeMode === 'demo-cinema' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Cinematic bass rumble sweep, overhead height shimmer, and wide orchestral swell.
          </p>
          {activeMode === 'demo-cinema' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Cinema
            </button>
          ) : (
            <button
              onClick={handleStartCinema}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play Cinema Demo
            </button>
          )}
        </div>

        {/* Card 4: Gaming 360 Tactical Footsteps */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'demo-gaming'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                Gaming 3D Positional
              </span>
            </div>
            {activeMode === 'demo-gaming' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Simulates dynamic footsteps stepping behind, flanking left/right, and overhead.
          </p>
          {activeMode === 'demo-gaming' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Gaming
            </button>
          ) : (
            <button
              onClick={handleStartGaming}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play Gaming Footsteps
            </button>
          )}
        </div>

        {/* Card 5: Spatial Rainstorm & Overhead Thunder */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'demo-nature'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                3D Rainstorm & Thunder
              </span>
            </div>
            {activeMode === 'demo-nature' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Immersion test using 4 overhead Atmos height speakers with spatial rain.
          </p>
          {activeMode === 'demo-nature' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Rainstorm
            </button>
          ) : (
            <button
              onClick={handleStartNature}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play 3D Rainstorm
            </button>
          )}
        </div>

        {/* Card 6: Upload Audio File */}
        <div className={`p-4 rounded-xl border transition-all ${
          activeMode === 'user-file'
            ? 'bg-blue-600/15 border-blue-500 shadow-md'
            : darkMode ? 'bg-zinc-900/60 border-white/5' : 'bg-zinc-100/70 border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Upload className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs text-zinc-200">
                Custom Audio File
              </span>
            </div>
            {activeMode === 'user-file' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                PLAYING
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mb-3">
            Upload MP3, WAV, FLAC or AAC to upmix into full 7.1.4 Dolby Atmos sound.
          </p>
          <input 
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {activeMode === 'user-file' ? (
            <button
              onClick={handleStop}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Custom Audio
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Choose Audio File...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
