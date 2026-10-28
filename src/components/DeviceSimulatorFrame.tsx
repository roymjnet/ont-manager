import React from 'react';
import { Smartphone, Monitor, Maximize2, ShieldCheck, Wifi } from 'lucide-react';

interface DeviceSimulatorFrameProps {
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
  children: React.ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  isSimulatorActive,
  onToggleSimulator,
  children
}) => {
  if (!isSimulatorActive) {
    return <div className="w-full h-full min-h-0 flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950 overflow-y-auto min-h-0">
      {/* Device wrapper mockup */}
      <div className="relative flex flex-col items-center">
        {/* Frame Top Info */}
        <div className="mb-2 flex items-center justify-between w-full max-w-[402px] px-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>iPhone 16 Pro Viewport (402 × 874)</span>
          </div>
          <button
            onClick={onToggleSimulator}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition underline underline-offset-2"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Kembali ke Desktop</span>
          </button>
        </div>

        {/* The Phone Bezel */}
        <div
          className="relative bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: '402px',
            height: '874px',
            maxHeight: 'calc(100vh - 110px)'
          }}
        >
          {/* Dynamic Island / Speaker notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-10 w-full pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none z-40 bg-slate-950/80 backdrop-blur-xs">
            <span>09:41</span>
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-5 h-2.5 border border-slate-400 rounded-xs p-0.5 flex items-center">
                <div className="w-3.5 h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col bg-slate-950 relative">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="h-5 w-full bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
