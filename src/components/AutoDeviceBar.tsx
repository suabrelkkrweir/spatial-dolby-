import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Speaker, 
  Bluetooth, 
  Cpu, 
  Tv, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Zap, 
  Volume2,
  Check,
  Radio,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { DeviceCategory, OutputDeviceInfo, SpatialAudioSettings } from '../types';
import { deviceDetector } from '../services/deviceDetector';

interface AutoDeviceBarProps {
  darkMode: boolean;
  onApplyCalibration: (calib: Partial<SpatialAudioSettings>, deviceName: string) => void;
  currentDriverName: string;
}

export const AutoDeviceBar: React.FC<AutoDeviceBarProps> = ({
  darkMode,
  onApplyCalibration,
  currentDriverName
}) => {
  const [devices, setDevices] = useState<OutputDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<OutputDeviceInfo | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState<string | null>(null);
  const [autoCalibrateOnConnect, setAutoCalibrateOnConnect] = useState(true);

  // Auto-fetch connected devices on mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setIsDetecting(true);
    try {
      const detected = await deviceDetector.detectOutputDevices();
      setDevices(detected);
      if (detected.length > 0 && !selectedDevice) {
        setSelectedDevice(detected[0]);
      }
    } catch (err) {
      console.warn('Error fetching audio devices:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectDevice = (dev: OutputDeviceInfo) => {
    setSelectedDevice(dev);
    if (autoCalibrateOnConnect) {
      triggerCalibration(dev);
    }
  };

  const triggerCalibration = (dev: OutputDeviceInfo) => {
    setIsCalibrating(true);
    setCalibrationSuccess(null);

    // Play subtle Apple calibration sweep tone
    deviceDetector.playCalibrationSweep();

    setTimeout(() => {
      const tuned = deviceDetector.generateCalibration(dev);
      onApplyCalibration(tuned, dev.label);
      setIsCalibrating(false);
      setCalibrationSuccess(`Auto-Adjusted & Optimized for ${dev.label.split('(')[0].trim()}`);

      setTimeout(() => {
        setCalibrationSuccess(null);
      }, 5000);
    }, 950);
  };

  const handleAutoAdjustClick = () => {
    if (!selectedDevice && devices.length > 0) {
      triggerCalibration(devices[0]);
    } else if (selectedDevice) {
      triggerCalibration(selectedDevice);
    }
  };

  const getDeviceIcon = (cat?: DeviceCategory, className = "w-5 h-5") => {
    switch (cat) {
      case 'headphones':
        return <Headphones className={`${className} text-blue-400`} />;
      case 'bluetooth':
        return <Bluetooth className={`${className} text-sky-400`} />;
      case 'speakers':
        return <Speaker className={`${className} text-indigo-400`} />;
      case 'usb_dac':
        return <Cpu className={`${className} text-amber-400`} />;
      case 'hdmi_surround':
        return <Tv className={`${className} text-purple-400`} />;
      default:
        return <Headphones className={`${className} text-blue-400`} />;
    }
  };

  return (
    <div 
      id="auto-device-detection-panel"
      className={`relative rounded-3xl border backdrop-blur-2xl p-5 shadow-2xl overflow-hidden transition-all ${
        darkMode 
          ? 'bg-white/[0.035] border-white/15 text-white' 
          : 'bg-white/85 border-black/10 text-zinc-900 shadow-xl'
      }`}
    >
      {/* Specular Liquid Glass Highlight Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

      {/* Header bar: Title, rescan, and Auto-Adjust Master Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif]">
              Auto Device Detection & Calibration
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
              {devices.length} Detected
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select any connected hardware endpoint to auto-tune 7.1.4 HRTF binaural filters, soundstage width, and Dolby dialogue levels.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchDevices}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Scan for connected audio devices"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isDetecting ? 'Scanning...' : 'Rescan'}</span>
          </button>

          <button
            id="auto-calibrate-btn"
            onClick={handleAutoAdjustClick}
            disabled={isCalibrating}
            className={`relative group px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg overflow-hidden shrink-0 ${
              isCalibrating
                ? 'bg-blue-600/80 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white shadow-blue-500/30 border border-white/20'
            }`}
          >
            {/* Liquid glass light reflection sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <Sparkles className={`w-4 h-4 text-amber-300 ${isCalibrating ? 'animate-spin' : ''}`} />
            <span>
              {isCalibrating ? 'Calibrating Acoustics...' : 'Auto-Adjust Spatial Sound'}
            </span>
          </button>
        </div>
      </div>

      {/* PROMINENT VISIBLE DEVICE LIST (Directly exposed on the card face, NOT hidden in a dropdown) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium px-1">
          <span>SELECT ACTIVE HARDWARE DEVICE:</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-zinc-200">
            <input 
              type="checkbox"
              checked={autoCalibrateOnConnect}
              onChange={(e) => setAutoCalibrateOnConnect(e.target.checked)}
              className="rounded accent-blue-500 cursor-pointer"
            />
            <span>Auto-tune upon selection</span>
          </label>
        </div>

        {/* Visible Device Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {devices.map((dev) => {
            const isSelected = selectedDevice?.id === dev.id;
            return (
              <div
                key={dev.id}
                onClick={() => handleSelectDevice(dev)}
                className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left overflow-hidden ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-400/60 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-zinc-300'
                }`}
              >
                {/* Active selection glow accent */}
                {isSelected && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/25 rounded-full blur-xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isSelected 
                        ? 'bg-blue-500/30 border-blue-400/40' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      {getDeviceIcon(dev.category, "w-5 h-5")}
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">
                        {dev.category.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold leading-tight truncate mb-1 ${
                    isSelected ? 'text-white' : 'text-zinc-200'
                  }`}>
                    {dev.label}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span>{dev.channelCount === 8 ? '7.1.4 Surround' : '2.0 Binaural'}</span>
                    <span>•</span>
                    <span>{dev.sampleRate / 1000} kHz</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">
                    Profile: <strong className="text-blue-300 capitalize">{dev.recommendedProfile}</strong>
                  </span>
                  <span className={`font-semibold flex items-center gap-0.5 transition-transform ${
                    isSelected ? 'text-blue-400' : 'text-zinc-400 group-hover:translate-x-0.5'
                  }`}>
                    {isSelected ? 'Optimized' : 'Select'}
                    {!isSelected && <ChevronRight className="w-3 h-3" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calibration Success Feedback Notification */}
      {calibrationSuccess && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{calibrationSuccess}</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
            Acoustics & HRTF Pinna Matched
          </span>
        </div>
      )}
    </div>
  );
};
