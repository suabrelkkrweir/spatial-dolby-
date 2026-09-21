import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Volume2, 
  Move3d, 
  Cpu, 
  BookOpen,
  Zap,
  Radio,
  Sliders,
  Maximize2
} from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  targetTab?: 'soundstage' | 'advanced' | 'equalizer';
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onSwitchTab?: (tab: 'soundstage' | 'advanced' | 'equalizer') => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  darkMode,
  onSwitchTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  const steps: TourStep[] = [
    {
      targetId: 'app-titlebar',
      title: 'Spatial Sound Controller for Windows',
      subtitle: 'Apple-Inspired Liquid Glass Interface',
      description: 'Welcome! This application turns all your Windows audio, music, video, and gaming sound into immersive 7.1.4 Dolby Atmos binaural spatial audio.',
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      badge: 'Welcome',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'master-spatial-quick-toggle',
      title: 'Master Windows Spatial Switch',
      subtitle: 'Universal All-Window Output Spatialization',
      description: 'Toggle this switch to turn spatial audio ON or OFF. When active, all audio is upmixed into 12 discrete spatial channels with binaural HRTF elevation.',
      icon: <Volume2 className="w-5 h-5 text-indigo-400" />,
      badge: 'Step 1 of 7',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'auto-device-detection-panel',
      title: 'Auto Device Detection & Auto-Adjust',
      subtitle: 'Intelligent One-Click Hardware Optimization',
      description: 'The app automatically identifies your headphones, speakers, or Bluetooth audio output. Click "Auto-Adjust" to immediately calibrate room acoustics and HRTF filters.',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      badge: 'Step 2 of 7',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'spatial-soundstage-radar',
      title: 'Interactive 3D Soundstage Radar',
      subtitle: '360° Positional Audio & Height Channels',
      description: 'Drag the sound source puck anywhere around your head in real time. Adjust elevation (Z-axis) for overhead speakers, or click Auto Orbit to hear it glide in 360° space.',
      icon: <Move3d className="w-5 h-5 text-emerald-400" />,
      badge: 'Step 3 of 7',
      targetTab: 'soundstage',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'dolby-control-panel',
      title: 'Dolby Audio Immersion Suite',
      subtitle: 'Dialogue Enhancer, Bass Management & Leveler',
      description: 'Isolate and clarify speech frequencies in movies, boost punchy low-frequency sub-bass effects, and keep volume consistent across all open windows.',
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      badge: 'Step 4 of 7',
      targetTab: 'soundstage',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'sound-test-engine',
      title: 'Live Windows Capture & 3D Test Suite',
      subtitle: 'Route Real Windows Apps or Play 3D Demos',
      description: 'Click "Capture System Audio" to stream games or media into spatial sound, or play built-in 3D Orbit, Cinema, and Gaming Footstep demos with instant A/B stereo comparison.',
      icon: <Radio className="w-5 h-5 text-sky-400" />,
      badge: 'Step 5 of 7',
      preferredPosition: 'top'
    },
    {
      targetId: 'driver-selector-btn',
      title: 'Universal Driver Compatibility Matrix',
      subtitle: 'Dolby Atmos, Realtek WASAPI, ASIO & Bluetooth',
      description: 'Click here anytime to switch audio drivers, calibrate buffer sizes (64 to 1024 samples), and achieve ultra-low 1.8ms monitoring latency.',
      icon: <Sliders className="w-5 h-5 text-blue-400" />,
      badge: 'Step 6 of 7',
      preferredPosition: 'bottom'
    },
    {
      targetId: 'top-manual-guide-btn',
      title: 'User Manual & Reference Guide',
      subtitle: 'Complete Documentation at Your Fingertips',
      description: 'Click "Manual Guide" whenever you need help configuring Windows audio routing, troubleshooting drivers, or fine-tuning advanced acoustic settings.',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      badge: 'Step 7 of 7',
      preferredPosition: 'bottom'
    }
  ];

  const currentStepData = steps[currentStep];

  // Update target element measurement
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;
    const step = steps[currentStep];
    if (!step) return;

    if (step.targetTab && onSwitchTab) {
      onSwitchTab(step.targetTab);
    }

    const elem = document.getElementById(step.targetId);
    if (elem) {
      // Scroll element smoothly into view with padding
      elem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      
      // Delay slightly for smooth scroll to settle
      setTimeout(() => {
        const rect = elem.getBoundingClientRect();
        setTargetRect(rect);
        setIsMeasuring(false);
      }, 150);
    } else {
      setTargetRect(null);
      setIsMeasuring(false);
    }
  }, [currentStep, isOpen, onSwitchTab, steps]);

  useEffect(() => {
    updateTargetRect();

    const handleResizeOrScroll = () => {
      const step = steps[currentStep];
      if (!step) return;
      const elem = document.getElementById(step.targetId);
      if (elem) {
        setTargetRect(elem.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [currentStep, updateTargetRect]);

  // Keyboard navigation (Arrow keys & Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStep < steps.length - 1) {
          setCurrentStep(c => c + 1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep(c => c - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, steps.length, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Compute optimal tooltip card position based on target rect and viewport
  const getTooltipStyle = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const
      };
    }

    const padding = 16;
    const cardWidth = Math.min(420, window.innerWidth - 32);
    const cardHeight = 240;

    let top = targetRect.bottom + padding;
    let arrowOnTop = true;

    // If target is too low, place tooltip above the target
    if (top + cardHeight > window.innerHeight - 20) {
      top = targetRect.top - cardHeight - padding;
      arrowOnTop = false;
    }

    // Horizontal centering relative to target
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    // Keep card inside viewport margins
    left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

    return {
      top: `${Math.max(16, top)}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      position: 'fixed' as const,
      arrowOnTop
    };
  };

  const tooltipPosition = getTooltipStyle();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* 
        Spotlight Cutout Backdrop:
        We create a fixed cutout spotlight over targetRect using SVG mask or large shadow
      */}
      {targetRect && (
        <div 
          className="fixed transition-all duration-300 pointer-events-none rounded-2xl"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(5, 7, 12, 0.78), 0 0 35px rgba(59, 130, 246, 0.55)',
            border: '2px solid rgba(96, 165, 250, 0.85)',
          }}
        >
          {/* Animated beacon ring & glowing corners */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white" />
          </span>

          <span className="absolute -bottom-1.5 -left-1.5 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400/80" />
          </span>

          {/* Indicator tag attached directly to the element */}
          <div className="absolute -top-7 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-bold tracking-wider shadow-lg flex items-center gap-1">
            <span>TARGET FOCUS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>
      )}

      {/* If no targetRect found (fallback full backdrop) */}
      {!targetRect && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md pointer-events-auto" />
      )}

      {/* Floating Liquid Glass Tour Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: tooltipPosition.width,
          position: tooltipPosition.position
        }}
        className={`pointer-events-auto rounded-3xl border shadow-2xl p-5 overflow-hidden backdrop-blur-2xl transition-all ${
          darkMode 
            ? 'bg-[#121626]/95 border-white/20 text-white shadow-blue-500/25' 
            : 'bg-white/95 border-black/15 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Specular Liquid Glass Highlight Accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Step Badge, Target Label & Close Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {currentStepData.badge}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Close tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3.5 mb-2.5">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 shadow-inner shrink-0 mt-0.5">
            {currentStepData.icon}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold tracking-tight leading-tight">
              {currentStepData.title}
            </h3>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">
              {currentStepData.subtitle}
            </p>
          </div>
        </div>

        {/* Step description */}
        <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          {currentStepData.description}
        </p>

        {/* Interactive Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500/50' 
                  : 'w-1.5 bg-white/25 hover:bg-white/40'
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Exit Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl border border-white/15 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-1.5 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
