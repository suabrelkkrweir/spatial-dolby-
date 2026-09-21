import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, Compass, ArrowUpRight, Volume2, Orbit, Move3d } from 'lucide-react';
import { INITIAL_714_SPEAKERS } from '../services/audioEngine';

interface SpatialRadarProps {
  darkMode: boolean;
  soundSource: { x: number; y: number; z: number };
  onUpdateSoundSource: (x: number, y: number, z: number) => void;
  listenerYaw: number;
  onUpdateListenerYaw: (yaw: number) => void;
  isOrbiting: boolean;
  onToggleOrbit: () => void;
  isAudioPlaying: boolean;
  globalSpatialEnabled: boolean;
}

export const SpatialRadar: React.FC<SpatialRadarProps> = ({
  darkMode,
  soundSource,
  onUpdateSoundSource,
  listenerYaw,
  onUpdateListenerYaw,
  isOrbiting,
  onToggleOrbit,
  isAudioPlaying,
  globalSpatialEnabled
}) => {
  const radarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [elevation, setElevation] = useState(soundSource.z);

  // Sync elevation
  useEffect(() => {
    setElevation(soundSource.z);
  }, [soundSource.z]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!radarRef.current) return;
    const rect = radarRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const relX = (e.clientX - centerX) / radius;
    const relY = -(e.clientY - centerY) / radius; // Invert Y so up is forward

    // Constrain to unit circle
    const dist = Math.sqrt(relX * relX + relY * relY);
    const clampedDist = Math.min(1.0, dist);
    const angle = Math.atan2(relY, relX);

    const clampedX = clampedDist * Math.cos(angle);
    const clampedY = clampedDist * Math.sin(angle);

    onUpdateSoundSource(clampedX, clampedY, elevation);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Convert normalized X,Y (-1 to 1) to percentage inside radar container
  const sourcePercentX = 50 + (soundSource.x * 40);
  const sourcePercentY = 50 - (soundSource.y * 40);

  // Azimuth calculation in degrees (-180 to 180)
  const azimuthDeg = Math.round(Math.atan2(soundSource.x, soundSource.y) * (180 / Math.PI));
  const distanceMeters = (Math.sqrt(soundSource.x * soundSource.x + soundSource.y * soundSource.y) * 2.5).toFixed(1);

  return (
    <div 
      id="spatial-soundstage-radar"
      className={`relative flex flex-col p-5 rounded-2xl border backdrop-blur-2xl transition-all overflow-hidden ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 shadow-2xl' 
          : 'bg-white/80 border-black/10 shadow-lg'
      }`}
    >
      {/* Specular glass reflection line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {/* Top Header of Radar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <Move3d className="w-4 h-4 text-blue-500" />
              3D Soundstage & Speaker Array
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">
              Dolby 7.1.4
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Drag the sound puck to steer spatial audio in 360° space around listener.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="orbit-toggle-btn"
            onClick={onToggleOrbit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isOrbiting 
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                : darkMode 
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/10' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
            }`}
          >
            <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? 'animate-spin' : ''}`} />
            <span>{isOrbiting ? 'Orbiting 360°' : 'Auto Orbit'}</span>
          </button>

          <button
            id="center-reset-btn"
            onClick={() => onUpdateSoundSource(0, 0.8, 0.2)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              darkMode 
                ? 'bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 border-white/10' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200'
            }`}
            title="Reset position to front center"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Radar Circle Stage */}
      <div className="relative flex items-center justify-center my-2 select-none">
        <div 
          ref={radarRef}
          onPointerDown={handlePointerDown}
          onPointerMove={isDragging ? handlePointerMove : undefined}
          onPointerUp={handlePointerUp}
          className={`relative w-72 h-72 sm:w-84 sm:h-84 rounded-full border cursor-crosshair overflow-hidden touch-none transition-colors ${
            darkMode 
              ? 'bg-gradient-to-b from-zinc-950/80 via-[#0d101a] to-zinc-950/80 border-white/15' 
              : 'bg-gradient-to-b from-slate-50 via-zinc-100 to-slate-100 border-black/10'
          }`}
        >
          {/* Radar Concentric Distance Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[85%] h-[85%] rounded-full border border-dashed border-blue-500/20" />
            <div className="w-[60%] h-[60%] rounded-full border border-blue-500/15" />
            <div className="w-[35%] h-[35%] rounded-full border border-blue-500/25" />
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-blue-500/10" />
            <div className="absolute h-full w-[1px] bg-blue-500/10" />
          </div>

          {/* Cardinal Direction Markers */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider text-blue-400/70 pointer-events-none">
            FRONT
          </span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider text-zinc-500 pointer-events-none">
            REAR
          </span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider text-zinc-500 pointer-events-none">
            L
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider text-zinc-500 pointer-events-none">
            R
          </span>

          {/* 12 Dolby 7.1.4 Speakers */}
          {INITIAL_714_SPEAKERS.map(spk => {
            const posX = 50 + (spk.x * 40);
            const posY = 50 - (spk.y * 40);
            const isHeight = spk.id.startsWith('T');

            return (
              <div
                key={spk.id}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              >
                <div 
                  style={{ backgroundColor: spk.color }}
                  className={`w-3 h-3 rounded-full flex items-center justify-center shadow-xs transition-all ${
                    isHeight ? 'ring-2 ring-emerald-400/50' : 'ring-1 ring-white/30'
                  } ${globalSpatialEnabled && isAudioPlaying ? 'scale-110 shadow-md' : 'opacity-80'}`}
                />
                <span className="text-[9px] font-medium tracking-tight text-zinc-400 mt-0.5">
                  {spk.id}
                </span>
              </div>
            );
          })}

          {/* Center Listener Head */}
          <div 
            style={{ transform: `translate(-50%, -50%) rotate(${listenerYaw}deg)` }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center pointer-events-none transition-transform duration-100"
          >
            {/* Nose pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-blue-400 rounded-t-sm" />
            {/* Left ear */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-blue-400 rounded-l-full" />
            {/* Right ear */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-blue-400 rounded-r-full" />
            {/* Center head dot */}
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          {/* Draggable Active Sound Source Puck */}
          <div
            style={{ 
              left: `${sourcePercentX}%`, 
              top: `${sourcePercentY}%`,
              transition: isDragging ? 'none' : 'all 0.15s ease-out'
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            {/* Audio Ripples when playing */}
            {isAudioPlaying && globalSpatialEnabled && (
              <>
                <div className="absolute inset-0 -m-3 rounded-full border border-blue-400/60 animate-ping" />
                <div className="absolute inset-0 -m-6 rounded-full border border-indigo-400/30 animate-pulse" />
              </>
            )}

            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 text-white shadow-lg shadow-blue-500/50 flex items-center justify-center border-2 border-white cursor-grab active:cursor-grabbing">
              <Volume2 className="w-3.5 h-3.5" />
            </div>

            {/* Height elevation label */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-zinc-900/90 text-[9px] font-mono text-blue-300 border border-white/10 shadow-xs">
              Z: {elevation > 0 ? `+${elevation.toFixed(2)}` : elevation.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Coordinate Telemetry & Elevation Control */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
        <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-900/60' : 'bg-zinc-100'}`}>
          <span className="text-[10px] text-zinc-400 block font-medium">Azimuth Angle</span>
          <span className="font-mono font-semibold text-zinc-200">
            {azimuthDeg}° {azimuthDeg > 0 ? 'Right' : azimuthDeg < 0 ? 'Left' : 'Center'}
          </span>
        </div>

        <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-900/60' : 'bg-zinc-100'}`}>
          <span className="text-[10px] text-zinc-400 block font-medium">Distance</span>
          <span className="font-mono font-semibold text-zinc-200">
            {distanceMeters} meters
          </span>
        </div>

        <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-900/60' : 'bg-zinc-100'}`}>
          <span className="text-[10px] text-zinc-400 block font-medium">Height Channel</span>
          <span className="font-mono font-semibold text-emerald-400">
            {elevation >= 0.5 ? 'Overhead Atmos' : elevation >= 0 ? 'Ear Level' : 'Floor Sub'}
          </span>
        </div>
      </div>

      {/* Elevation Slider */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
          Vertical Height (Z-Axis):
        </span>
        <input 
          type="range"
          min="-0.8"
          max="0.9"
          step="0.05"
          value={elevation}
          onChange={(e) => {
            const newZ = parseFloat(e.target.value);
            setElevation(newZ);
            onUpdateSoundSource(soundSource.x, soundSource.y, newZ);
          }}
          className="flex-1 h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
        />
        <span className="text-xs font-mono text-zinc-300 w-10 text-right">
          {elevation.toFixed(2)}
        </span>
      </div>

      {/* Head Rotation Slider */}
      <div className="mt-2 flex items-center gap-3">
        <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
          Head Yaw Rotation:
        </span>
        <input 
          type="range"
          min="-180"
          max="180"
          step="5"
          value={listenerYaw}
          onChange={(e) => onUpdateListenerYaw(parseInt(e.target.value))}
          className="flex-1 h-1.5 rounded-lg appearance-none bg-zinc-700 accent-blue-500 cursor-pointer"
        />
        <span className="text-xs font-mono text-zinc-300 w-10 text-right">
          {listenerYaw}°
        </span>
      </div>
    </div>
  );
};
