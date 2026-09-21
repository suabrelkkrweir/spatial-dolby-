/**
 * Spatial Audio Controller Types
 * Precision audio driver abstractions, Dolby Atmos processing, and 3D acoustics
 */

export type AudioDriverId = 
  | 'windows-sonic'
  | 'dolby-atmos'
  | 'realtek-wasapi'
  | 'asio-pro'
  | 'bluetooth-lc3'
  | 'directsound-generic';

export interface AudioDriver {
  id: AudioDriverId;
  name: string;
  manufacturer: string;
  type: 'WASAPI' | 'ASIO' | 'UWP Spatial' | 'Kernel Streaming' | 'Bluetooth LE';
  bufferSize: number; // samples (e.g. 64, 128, 256, 512)
  sampleRate: number; // e.g. 48000, 96000
  latencyMs: number;
  bitDepth: 16 | 24 | 32;
  channels: '2.0 Stereo' | '5.1 Surround' | '7.1 Surround' | '7.1.4 Dolby Atmos';
  status: 'active' | 'ready' | 'standby';
  description: string;
  badge?: string;
}

export type SoundProfile = 'cinema' | 'gaming' | 'music' | 'podcast' | 'custom';

export type RoomMaterial = 'acoustic_foam' | 'wood_panel' | 'concrete' | 'velvet_drapes' | 'glass_studio';

export type HRTFProfile = 'reference_neutral' | 'wide_pinna' | 'deep_immersion' | 'intimate_studio';

export interface SpatialAudioSettings {
  // Master switches
  globalSpatialEnabled: boolean; // "Turn on all window output audio to spatial"
  dolbyImmersionEnabled: boolean;
  headTrackingEnabled: boolean;
  binauralUpmixEnabled: boolean;

  // Sound Profile
  profile: SoundProfile;

  // Soundstage & Placement
  soundstageWidth: number; // 0 to 200% (100% standard, 150% ultra-wide)
  elevationDepth: number; // -1.0 to 1.0 (height channel balance)
  centerChannelFocus: number; // 0 to 100% (speech clarity / phantom center)
  lfeSubwooferLevel: number; // -12dB to +12dB
  
  // Dolby Audio Processing Suite
  dolbyDialogueEnhancer: number; // 0 to 100% (intelligibility boost)
  dolbyBassManagement: number; // 0 to 100% (sub-harmonic exciter)
  dolbyVolumeLeveler: number; // 0 to 100% (dynamic range compression)
  dolbySurroundVirtualizer: number; // 0 to 100% (3D Haas binaural delay)
  
  // Advanced Acoustic & Room Properties
  roomSize: 'small' | 'medium' | 'large' | 'cathedral';
  roomMaterial: RoomMaterial;
  reverbDecayTime: number; // 0.2s to 4.0s
  earlyReflectionsMix: number; // 0 to 100%
  wallAbsorption: number; // 0 to 100%
  
  // HRTF & Anatomical Tuning
  hrtfProfile: HRTFProfile;
  headCircumferenceCm: number; // 50 to 65 cm (influences ITD calculation)
  earDistanceDelayMs: number; // 0.1ms to 0.8ms
  highFreqPinnaNotch: boolean; // Anatomical pinna filter

  // Listener Coordinates
  listenerYaw: number; // -180 to 180 degrees (head direction)
  listenerPitch: number; // -90 to 90 degrees
  
  // Selected Audio Driver
  selectedDriverId: AudioDriverId;
  masterVolume: number; // 0 to 100%
}

export interface SoundObject3D {
  id: string;
  label: string;
  channel: 'L' | 'R' | 'C' | 'LFE' | 'Ls' | 'Rs' | 'Lrs' | 'Rrs' | 'Tfl' | 'Tfr' | 'Trl' | 'Trr';
  x: number; // -1 to 1
  y: number; // -1 to 1 (front to back)
  z: number; // -1 to 1 (elevation height)
  gain: number;
  active: boolean;
  color: string;
}

export interface EqualizerBand {
  freq: number;
  label: string;
  gain: number; // -12 to +12 dB
}

export type AudioInputMode = 
  | 'system-screen' // Live Windows System / Screen / Tab audio capture
  | 'demo-orbit' // 360 spatial test tone orbiting listener
  | 'demo-cinema' // Dolby Atmos cinematic trailer
  | 'demo-gaming' // Positional footsteps & spatial gunfire
  | 'demo-nature' // 3D rainstorm & spatial thunder
  | 'demo-synth' // High fidelity ambient electronic piece
  | 'microphone' // Live line-in / mic monitoring
  | 'user-file'; // Custom uploaded audio track

export type DeviceCategory = 'headphones' | 'speakers' | 'bluetooth' | 'usb_dac' | 'hdmi_surround';

export interface OutputDeviceInfo {
  id: string;
  label: string;
  category: DeviceCategory;
  channelCount: number;
  sampleRate: number;
  isDefault: boolean;
  recommendedProfile: SoundProfile;
}

export interface StartupSettings {
  autoRunAtStartup: boolean; // Launch on Windows boot
  startupMode: 'normal' | 'mini' | 'tray_minimized'; // Mode on launch
  startInLowResourceMode: boolean; // Auto-enable low CPU & RAM mode at boot
  autoCalibrateOnDeviceChange: boolean; // Recalibrate on device plug-in
}

export interface SystemPerformanceTelemetry {
  cpuUsagePercent: number;
  memoryUsageMb: number;
  audioThreadLatencyMs: number;
  fftResolution: number;
  renderFps: number;
}

