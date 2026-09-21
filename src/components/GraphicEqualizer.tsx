import React, { useState } from 'react';
import { Sliders, RotateCcw, Volume2 } from 'lucide-react';
import { EqualizerBand } from '../types';
import { audioEngine, DEFAULT_EQ_BANDS } from '../services/audioEngine';

interface GraphicEqualizerProps {
  darkMode: boolean;
}

export const GraphicEqualizer: React.FC<GraphicEqualizerProps> = ({ darkMode }) => {
  const [bands, setBands] = useState<EqualizerBand[]>(DEFAULT_EQ_BANDS);

  const presets = [
    { name: 'Dolby Movie Reference', values: [2, 3, 1, 0, -1, 1, 2.5, 3, 2, 1.5] },
    { name: 'Tactical Gaming (Footsteps)', values: [-2, -1, 0, 1, 2, 3.5, 4, 4.5, 3, 1] },
    { name: 'Bass Immersion', values: [6, 5.5, 4, 2, 0, 0, 0, 1, 1.5, 1] },
    { name: 'Vocal Dialog Clarity', values: [-3, -2, -1, 1, 3, 4.5, 4, 2.5, 1, 0] },
    { name: 'Flat Reference', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ];

  const handleGainChange = (index: number, val: number) => {
    const updated = [...bands];
    updated[index].gain = val;
    setBands(updated);
    audioEngine.setEqGain(index, val);
  };

  const applyPreset = (values: number[]) => {
    const updated = bands.map((b, i) => ({ ...b, gain: values[i] ?? 0 }));
    setBands(updated);
    values.forEach((v, i) => audioEngine.setEqGain(i, v));
  };

  return (
    <div 
      id="graphic-equalizer-panel"
      className={`relative p-5 rounded-2xl border backdrop-blur-2xl transition-all overflow-hidden ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 shadow-2xl' 
          : 'bg-white/80 border-black/10 shadow-lg'
      }`}
    >
      {/* Specular glass reflection line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-sm tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            10-Band Dolby Precision Graphic Equalizer
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Calibrate frequency response curves to match your headphones or speakers.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.values)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                darkMode 
                  ? 'bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 border-white/10' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={() => applyPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])}
            className={`p-1 rounded-lg text-zinc-400 hover:text-white transition-colors`}
            title="Reset to Flat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 10 Vertical Sliders */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-3 py-3">
        {bands.map((band, idx) => (
          <div key={band.freq} className="flex flex-col items-center">
            {/* Gain readout */}
            <span className="text-[10px] font-mono text-zinc-400 mb-2">
              {band.gain > 0 ? `+${band.gain}` : band.gain}
            </span>

            {/* Slider track */}
            <div className="h-32 sm:h-40 flex items-center justify-center">
              <input 
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={band.gain}
                onChange={(e) => handleGainChange(idx, parseFloat(e.target.value))}
                className="w-32 sm:w-40 -rotate-90 appearance-none bg-zinc-700 accent-blue-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Frequency label */}
            <span className="text-[10px] font-medium text-zinc-300 mt-2 whitespace-nowrap">
              {band.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
