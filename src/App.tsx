import React, { useState, useEffect } from 'react';
import {
  Wifi,
  CheckCircle2
} from 'lucide-react';
import { OntWebview } from './components/OntWebview';
import { DeviceSimulatorFrame } from './components/DeviceSimulatorFrame';
import { SettingsModal } from './components/SettingsModal';
import { OntState } from './types';

export default function App() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ONT Master State (Auto-logged in by default)
  const [ontState, setOntState] = useState<OntState>({
    brand: 'zte',
    ipAddress: '192.168.1.1',
    isLoggedIn: true,
    username: 'user',
    password: 'User23456',
    model: 'Exabit Fiber Dual-Band',
    firmware: 'V9.0.10P1N15',
    uptime: '14 Hari 6 Jam',
    wlan24: {
      enabled: true,
      ssid: 'Exabit_Fiber_2.4G',
      hidden: false,
      security: 'WPA2-PSK-AES',
      passphrase: 'User23456',
      maxClients: 32,
      channel: 'Auto (CH 6)'
    },
    wlan5g: {
      enabled: true,
      ssid: 'Exabit_Fiber_5G',
      hidden: false,
      security: 'WPA2-PSK-AES',
      passphrase: 'User23456',
      maxClients: 32,
      channel: 'Auto (CH 149)'
    },
    optical: {
      ponState: 'O5 (Normal)',
      rxPower: -19.45,
      txPower: 2.15,
      temperature: 42,
      voltage: 3.28
    },
    clients: [
      { id: 'c1', name: 'iPhone-16-Pro-User', ip: '192.168.1.102', mac: 'BC:D0:74:9A:12:34', band: '5G', rssi: -45, blocked: false },
      { id: 'c2', name: 'Samsung-Galaxy-S24', ip: '192.168.1.105', mac: '34:A3:95:88:62:EE', band: '5G', rssi: -52, blocked: false },
      { id: 'c3', name: 'Laptop-Workstation-PC', ip: '192.168.1.110', mac: 'E8:84:A5:41:22:90', band: '2.4G', rssi: -61, blocked: false },
      { id: 'c4', name: 'Smart-TV-LivingRoom', ip: '192.168.1.118', mac: 'F4:F5:D8:09:88:AB', band: '2.4G', rssi: -58, blocked: false }
    ]
  });

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Global Header (Minimal & Clean) */}
      <header className="h-12 bg-slate-950 border-b border-slate-800/90 px-3 sm:px-6 flex items-center justify-between shrink-0 z-40 select-none">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Exabit WiFi
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-bold tracking-wider">
              PANEL KONTROL
            </span>
          </div>
        </div>
      </header>

      {/* Full-Screen Automated ONT Webview Engine for PC & HP */}
      <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-900 overflow-hidden">
        <OntWebview
          ontState={ontState}
          setOntState={setOntState}
          autoCountdown={null}
          onCancelCountdown={() => {}}
          onNotify={showToast}
          isCompactMobile={isMobile}
        />
      </div>

      {/* Settings Modal if needed */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        ontState={ontState}
        setOntState={setOntState}
        onNotify={showToast}
      />
    </div>
  );
}
