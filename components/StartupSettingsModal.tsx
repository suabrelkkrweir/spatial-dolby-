import React, { useState, useEffect } from 'react';
import { 
  Power, 
  X, 
  Check, 
  Download, 
  Copy, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Layers, 
  FolderPlus,
  Info,
  CheckCircle2
} from 'lucide-react';
import { StartupSettings } from '../types';

interface StartupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  settings: StartupSettings;
  onUpdateSettings: (newSettings: Partial<StartupSettings>) => void;
}

export const StartupSettingsModal: React.FC<StartupSettingsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  settings,
  onUpdateSettings
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const powershellCommand = `$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut("$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\SpatialSoundController.lnk"); $Shortcut.TargetPath = "${window.location.href}"; $Shortcut.Save()`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(powershellCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 3000);
  };

  const handleDownloadBat = () => {
    const batContent = `@echo off
:: Windows Startup Launcher for Spatial Sound Controller
echo Registering Spatial Sound Controller in Windows Startup...
powershell -NoProfile -ExecutionPolicy Bypass -Command "${powershellCommand.replace(/"/g, '\\"')}"
echo Success! Spatial Sound Controller will now launch automatically at Windows boot.
timeout /t 3
`;
    const blob = new Blob([batContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Enable_Windows_Startup.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 overflow-hidden backdrop-blur-2xl transition-all ${
          darkMode 
            ? 'bg-[#101422]/95 border-white/20 text-white' 
            : 'bg-white/95 border-black/15 text-zinc-900'
        }`}
      >
        {/* Top Specular Sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-500/20 border border-white/15 text-blue-400">
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Windows Startup & Background Configuration
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure auto-run behavior and low-resource startup options.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Toggles */}
        <div className="space-y-4">
          {/* Master Auto-Run Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 mt-0.5">
                <Power className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm block">Auto-Run on Windows Startup</span>
                <span className="text-xs text-zinc-400">
                  Automatically start the spatial audio controller when you log in to Windows.
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ autoRunAtStartup: !settings.autoRunAtStartup })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.autoRunAtStartup ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.autoRunAtStartup ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Startup Mode Selection */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono block">
              Default Startup View Mode:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onUpdateSettings({ startupMode: 'normal' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.startupMode === 'normal'
                    ? 'bg-blue-600/25 border-blue-500/40 text-white'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-400 mb-1.5" />
                <span className="text-xs font-bold block">Normal Window</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Full spatial studio</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ startupMode: 'mini' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.startupMode === 'mini'
                    ? 'bg-blue-600/25 border-blue-500/40 text-white'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400 mb-1.5" />
                <span className="text-xs font-bold block">Mini / PiP View</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Compact floating widget</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ startupMode: 'tray_minimized' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.startupMode === 'tray_minimized'
                    ? 'bg-blue-600/25 border-blue-500/40 text-white'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-400 mb-1.5" />
                <span className="text-xs font-bold block">Minimized Tray</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Silent background DSP</span>
              </button>
            </div>
          </div>

          {/* Low Resource & Hardware Options */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block">Start in Low-Resource (Eco) Mode</span>
                <span className="text-[11px] text-zinc-400 block">
                  Limits background CPU usage to &lt; 0.3% and memory to ~15 MB.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.startInLowResourceMode}
                onChange={(e) => onUpdateSettings({ startInLowResourceMode: e.target.checked })}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-xs font-semibold block">Auto-Calibrate on Device Plug-In</span>
                <span className="text-[11px] text-zinc-400 block">
                  Automatically switch HRTF profile when headphones or Bluetooth connect.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoCalibrateOnDeviceChange}
                onChange={(e) => onUpdateSettings({ autoCalibrateOnDeviceChange: e.target.checked })}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Windows Integration Assistant */}
          <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">
                  Install into Windows Startup Folder
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Windows 10 / 11</span>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed">
              To have Windows automatically launch this app on PC boot, you can place a shortcut in your Windows Startup directory (<code className="bg-black/40 px-1 py-0.5 rounded text-blue-200">shell:startup</code>) or run this 1-click script:
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadBat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .bat Setup</span>
              </button>

              <button
                onClick={handleCopyCmd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Copied PowerShell Cmd!' : 'Copy PowerShell Setup'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
