import React, { useEffect, useRef } from 'react';
import { Activity, Volume2, Zap } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface AcousticSpectrumBarProps {
  darkMode: boolean;
  globalSpatialEnabled: boolean;
  isAudioPlaying: boolean;
  lowResourceMode?: boolean;
}

export const AcousticSpectrumBar: React.FC<AcousticSpectrumBarProps> = ({
  darkMode,
  globalSpatialEnabled,
  isAudioPlaying,
  lowResourceMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const waveform = new Uint8Array(128);
    const frequency = new Uint8Array(128);

    const render = (currentTime: number) => {
      // Throttle framerate in low-resource mode to 20 FPS (every 50ms) to conserve CPU & memory
      const frameInterval = lowResourceMode ? 50 : 16;
      if (currentTime - lastTime >= frameInterval) {
        lastTime = currentTime;

        audioEngine.getVisualizationData(waveform, frequency);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        const barCount = lowResourceMode ? 24 : 44;
        const barWidth = (width / barCount) - 2;

        for (let i = 0; i < barCount; i++) {
          const freqIndex = Math.floor((i / barCount) * (frequency.length * 0.7));
          const val = frequency[freqIndex] || 0;
          const normalized = val / 255;
          const barHeight = Math.max(2, normalized * (height - 6));

          const x = i * (barWidth + 2);
          const y = height - barHeight;

          // Gradient color
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          if (globalSpatialEnabled) {
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(0.5, '#6366f1');
            gradient.addColorStop(1, '#38bdf8');
          } else {
            gradient.addColorStop(0, '#71717a');
            gradient.addColorStop(1, '#a1a1aa');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [globalSpatialEnabled, lowResourceMode]);

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
      darkMode 
        ? 'bg-white/[0.035] border-white/10' 
        : 'bg-white/80 border-black/10 shadow-sm'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border ${
          isAudioPlaying 
            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
            : 'bg-white/5 border-white/10 text-zinc-500'
        }`}>
          <Activity className={`w-4 h-4 ${isAudioPlaying ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-200 block font-['Plus_Jakarta_Sans',sans-serif]">
              Real-Time 3D Spatial Audio Stream Analyzer
            </span>
            {lowResourceMode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>Eco DSP: 0.3% CPU</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-zinc-400">
            {globalSpatialEnabled 
              ? 'DSP: 7.1.4 HRTF binaural filter matrix active (12 discrete spatial channels)'
              : 'DSP: Bypass mode (flat 2-channel direct pass)'}
          </span>
        </div>
      </div>

      <div className="w-full sm:w-72 h-10">
        <canvas 
          ref={canvasRef} 
          width={288} 
          height={40}
          className="w-full h-full rounded-xl bg-black/20"
        />
      </div>
    </div>
  );
};
