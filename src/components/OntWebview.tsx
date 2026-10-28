import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Shield,
  Radio,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Check,
  CheckCircle2,
  Zap,
  Power,
  Users,
  Activity,
  Sliders,
  Sparkles,
  Info,
  Compass
} from 'lucide-react';
import { OntState, OntBrand } from '../types';
import { ONT_BRANDS, detectBrandFromIp } from '../data/ontBrands';

interface OntWebviewProps {
  ontState: OntState;
  setOntState: React.Dispatch<React.SetStateAction<OntState>>;
  autoCountdown: number | null;
  onCancelCountdown: () => void;
  onNotify: (msg: string) => void;
  isCompactMobile?: boolean;
}

export const OntWebview: React.FC<OntWebviewProps> = ({
  ontState,
  setOntState,
  autoCountdown,
  onCancelCountdown,
  onNotify,
  isCompactMobile = false
}) => {
  const [activeTab, setActiveTab] = useState<'wlan' | 'status' | 'clients' | 'system'>('wlan');
  const [wlanSubTab, setWlanSubTab] = useState<'2.4G' | '5G'>('2.4G');
  const [showPassword, setShowPassword] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootSeconds, setRebootSeconds] = useState(0);

  // Active brand profile
  const currentBrand = ONT_BRANDS.find(b => b.id === ontState.brand) || ONT_BRANDS[0];

  // Form states for WLAN editing
  const [ssid24, setSsid24] = useState(ontState.wlan24.ssid);
  const [pass24, setPass24] = useState(ontState.wlan24.passphrase);
  const [hidden24, setHidden24] = useState(ontState.wlan24.hidden);
  const [maxClients24, setMaxClients24] = useState(ontState.wlan24.maxClients);

  const [ssid5, setSsid5] = useState(ontState.wlan5g.ssid);
  const [pass5, setPass5] = useState(ontState.wlan5g.passphrase);
  const [hidden5, setHidden5] = useState(ontState.wlan5g.hidden);
  const [maxClients5, setMaxClients5] = useState(ontState.wlan5g.maxClients);

  // Sync state if changed externally
  useEffect(() => {
    setSsid24(ontState.wlan24.ssid);
    setPass24(ontState.wlan24.passphrase);
    setSsid5(ontState.wlan5g.ssid);
    setPass5(ontState.wlan5g.passphrase);
  }, [ontState]);

  // Auto-detect brand silently in the background based on IP (e.g., 192.168.0.1 -> TP-Link, 192.168.1.1 -> ZTE, etc.)
  useEffect(() => {
    const detected = detectBrandFromIp(ontState.ipAddress);
    if (detected !== ontState.brand) {
      const brand = ONT_BRANDS.find(b => b.id === detected);
      if (brand) {
        setOntState(prev => ({
          ...prev,
          brand: brand.id,
          model: brand.models[0],
          username: brand.defaultUser,
          password: brand.defaultPass
        }));
      }
    }
  }, [ontState.ipAddress, ontState.brand, setOntState]);


  // Apply Wi-Fi changes
  const handleApplyWifi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsApplying(true);
    setApplySuccess(false);

    setTimeout(() => {
      setOntState(prev => ({
        ...prev,
        wlan24: {
          ...prev.wlan24,
          ssid: ssid24,
          passphrase: pass24,
          hidden: hidden24,
          maxClients: maxClients24
        },
        wlan5g: {
          ...prev.wlan5g,
          ssid: ssid5,
          passphrase: pass5,
          hidden: hidden5,
          maxClients: maxClients5
        }
      }));
      setIsApplying(false);
      setApplySuccess(true);
      onNotify('Pengaturan sandi WiFi pada router Exabit berhasil disimpan!');
      setTimeout(() => setApplySuccess(false), 4000);
    }, 1100);
  };

  // Generate strong password
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (wlanSubTab === '2.4G') setPass24(res);
    else setPass5(res);
    onNotify(`Sandi acak dibuat: ${res}`);
  };

  // Handle Reboot ONT
  const handleReboot = () => {
    if (!confirm('Apakah Anda yakin ingin me-restart router Exabit WiFi? Koneksi internet akan terputus selama sekitar 45 detik.')) return;
    setIsRebooting(true);
    setRebootSeconds(45);
    const interval = setInterval(() => {
      setRebootSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRebooting(false);
          onNotify('Router Exabit WiFi selesai reboot. Koneksi internet normal.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Kick / block client
  const handleToggleBlockClient = (id: string) => {
    setOntState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c)
    }));
  };

  // Brand-specific theme constants
  const brandThemes = {
    zte: {
      bgGradient: 'bg-slate-900',
      headerBg: 'bg-slate-950 border-b border-blue-900/60',
      brandBadge: 'bg-blue-600 text-white',
      accentColor: 'text-cyan-400',
      activeTabClass: 'bg-blue-600 text-white shadow-xs',
      buttonGradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
      keyLabel: 'WPA Passphrase (Sandi WiFi)'
    },
    huawei: {
      bgGradient: 'bg-stone-900',
      headerBg: 'bg-stone-950 border-b border-rose-900/60',
      brandBadge: 'bg-red-600 text-white',
      accentColor: 'text-rose-400',
      activeTabClass: 'bg-red-600 text-white shadow-xs',
      buttonGradient: 'from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600',
      keyLabel: 'WPA PreSharedKey (Sandi WiFi Huawei)'
    },
    fiberhome: {
      bgGradient: 'bg-slate-900',
      headerBg: 'bg-slate-950 border-b border-amber-900/60',
      brandBadge: 'bg-orange-600 text-white',
      accentColor: 'text-amber-400',
      activeTabClass: 'bg-orange-600 text-white shadow-xs',
      buttonGradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
      keyLabel: 'Pre-Shared Key (Sandi WiFi FiberHome)'
    },
    nokia: {
      bgGradient: 'bg-slate-900',
      headerBg: 'bg-slate-950 border-b border-cyan-900/60',
      brandBadge: 'bg-blue-700 text-white',
      accentColor: 'text-cyan-300',
      activeTabClass: 'bg-blue-700 text-white shadow-xs',
      buttonGradient: 'from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600',
      keyLabel: 'WPA Key (Sandi WiFi Nokia)'
    },
    tplink: {
      bgGradient: 'bg-slate-900',
      headerBg: 'bg-slate-950 border-b border-teal-900/60',
      brandBadge: 'bg-teal-600 text-white',
      accentColor: 'text-teal-400',
      activeTabClass: 'bg-teal-600 text-white shadow-xs',
      buttonGradient: 'from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500',
      keyLabel: 'Wireless Password (Sandi WiFi TP-Link)'
    }
  };

  const theme = brandThemes[ontState.brand] || brandThemes.zte;

  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgGradient} text-slate-100 overflow-hidden relative select-none transition-colors duration-300`}>
      {/* Rebooting Screen Overlay */}
      {isRebooting && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
          <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Router Exabit WiFi Sedang Reboot...</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Mohon jangan matikan kabel adaptor daya router. Perangkat sedang me-restart sistem dan menyambungkan kembali jaringan fiber optik.
          </p>
          <div className="text-4xl font-mono font-bold text-amber-300 mb-2">{rebootSeconds}s</div>
          <span className="text-xs text-slate-500">Estimasi waktu pemulihan jaringan</span>
        </div>
      )}

      {/* Navigation Header */}
      <div className={`${theme.headerBg} px-3 py-2.5 flex items-center justify-between shrink-0 transition-colors`}>
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs tracking-wider flex items-center justify-center shadow-xs">
            EXABIT
          </div>
          <div>
            <div className="text-xs font-bold leading-none text-white flex items-center gap-2">
              <span>Exabit Fiber Router</span>
              <span className="text-[9px] font-normal px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800/50 font-mono">
                DUAL BAND
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
              Gateway: {ontState.ipAddress} • Jaringan Aktif
            </div>
          </div>
        </div>

        {/* Brand System Menu Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('wlan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'wlan'
                ? theme.activeTabClass
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>WLAN WiFi</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'clients'
                ? theme.activeTabClass
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pengguna ({ontState.clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'status'
                ? theme.activeTabClass
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Optik PON</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'system'
                ? theme.activeTabClass
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Reboot</span>
          </button>
        </div>
      </div>

      {/* Tab 1: WLAN Configuration (Morphs based on brand!) */}
      {activeTab === 'wlan' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Success notification banner */}
          {applySuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Sandi WiFi berhasil diperbarui pada router Exabit WiFi!
              </span>
            </div>
          )}

          {/* Breadcrumb path */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-mono bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Compass className={`w-3.5 h-3.5 ${theme.accentColor}`} />
              <span>Network</span>
              <span>&gt;</span>
              <span>WLAN</span>
              <span>&gt;</span>
              <span className="text-cyan-300 font-semibold">SSID &amp; Security Settings</span>
            </div>

            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-Login: {ontState.username}</span>
            </span>
          </div>

          {/* Frequency Band Selector (2.4GHz vs 5GHz) */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setWlanSubTab('2.4G')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                wlanSubTab === '2.4G'
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-sm`
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SSID 2.4 GHz (Jangkauan Luas)</span>
            </button>

            <button
              type="button"
              onClick={() => setWlanSubTab('5G')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                wlanSubTab === '5G'
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-sm`
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SSID 5.0 GHz (Kecepatan Tinggi)</span>
            </button>
          </div>

          {/* Configuration Form for Selected Band */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Sliders className={`w-4 h-4 ${theme.accentColor}`} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Konfigurasi Exabit WiFi — {wlanSubTab === '2.4G' ? '2.4 GHz' : '5 GHz'}
                </h3>
              </div>
              <button
                type="button"
                onClick={generateStrongPassword}
                className={`text-[11px] ${theme.accentColor} hover:opacity-80 flex items-center gap-1 font-semibold`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Acak Sandi Kuat</span>
              </button>
            </div>

            {wlanSubTab === '2.4G' ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    SSID Name (Nama WiFi 2.4G)
                  </label>
                  <input
                    type="text"
                    value={ssid24}
                    onChange={e => setSsid24(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      {theme.keyLabel}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Min. 8 Karakter</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pass24}
                      onChange={e => setPass24(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-xs text-slate-300">Sembunyikan WiFi (Hide SSID)</span>
                    <input
                      type="checkbox"
                      checked={hidden24}
                      onChange={e => setHidden24(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-xs text-slate-300">Batas Pengguna Maksimal</span>
                    <select
                      value={maxClients24}
                      onChange={e => setMaxClients24(Number(e.target.value))}
                      className="bg-slate-800 text-xs text-white rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
                    >
                      <option value={10}>10 Pengguna</option>
                      <option value={16}>16 Pengguna</option>
                      <option value={32}>32 Pengguna (Maks)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    SSID Name (Nama WiFi 5G)
                  </label>
                  <input
                    type="text"
                    value={ssid5}
                    onChange={e => setSsid5(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      {theme.keyLabel}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Min. 8 Karakter</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pass5}
                      onChange={e => setPass5(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-xs text-slate-300">Sembunyikan WiFi (Hide SSID)</span>
                    <input
                      type="checkbox"
                      checked={hidden5}
                      onChange={e => setHidden5(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <span className="text-xs text-slate-300">Batas Pengguna Maksimal</span>
                    <select
                      value={maxClients5}
                      onChange={e => setMaxClients5(Number(e.target.value))}
                      className="bg-slate-800 text-xs text-white rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
                    >
                      <option value={10}>10 Pengguna</option>
                      <option value={16}>16 Pengguna</option>
                      <option value={32}>32 Pengguna (Maks)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Apply Button (Simpan & Terapkan) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyWifi}
                disabled={isApplying}
                className={`w-full py-3 bg-gradient-to-r ${theme.buttonGradient} text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 active:scale-98`}
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menerapkan Pengaturan ke {currentBrand.name} {ontState.model}...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan & Terapkan Perubahan (Apply)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Connected Clients (Perangkat Terhubung) */}
      {activeTab === 'clients' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Daftar Perangkat Terhubung (DHCP Table)
              </h3>
              <p className="text-[11px] text-slate-400">
                {ontState.clients.length} perangkat terdeteksi di jaringan Exabit WiFi
              </p>
            </div>
            <button
              onClick={() => onNotify('Daftar perangkat diperbarui!')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Segarkan daftar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {ontState.clients.map(client => (
              <div
                key={client.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  client.blocked
                    ? 'bg-rose-950/30 border-rose-900/60 opacity-60'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{client.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                      client.band === '5G' ? 'bg-cyan-950 text-cyan-300' : 'bg-blue-950 text-blue-300'
                    }`}>
                      {client.band}
                    </span>
                    {client.blocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-900 text-rose-200 font-bold">
                        DIBLOKIR
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>IP: {client.ip}</span>
                    <span>MAC: {client.mac}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleBlockClient(client.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition shrink-0 ${
                    client.blocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                  }`}
                >
                  {client.blocked ? 'Izinkan' : 'Blokir'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Optical Power & PON Status */}
      {activeTab === 'status' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Diagnostik Optik Fiber (GPON Optical Status)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Koneksi Stabil
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Rx Optical Power (Redaman Masuk)
              </div>
              <div className={`text-2xl font-black font-mono ${theme.accentColor}`}>
                {ontState.optical.rxPower} dBm
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kategori Optimal (Normal: -15 s/d -24 dBm)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Tx Optical Power (Daya Pancar Laser)
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                +{ontState.optical.txPower} dBm
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                <span>Status GPON: <strong>{ontState.optical.ponState}</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Suhu Transceiver (Exabit Fiber)
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {ontState.optical.temperature} °C
              </div>
              <span className="text-[10px] text-slate-400">Temperatur operasional dingin & normal</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Tegangan Suplai (Operating Voltage)
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {ontState.optical.voltage} V
              </div>
              <span className="text-[10px] text-slate-400">Suplai tegangan stabil (3.3V)</span>
            </div>
          </div>

          {/* Lamp indicator guide */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Info className={`w-3.5 h-3.5 ${theme.accentColor}`} />
              <span>Panduan Indikator Lampu LED Router Exabit</span>
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>🟢 <strong>PON / LINK:</strong> Menyala hijau statis menandakan router telah terotentikasi ke OLT ISP.</li>
              <li>🔴 <strong>LOS:</strong> Jika berkedip merah, kabel fiber optik tertekuk, kotor, atau putus.</li>
              <li>🟢 <strong>WLAN 2.4G &amp; 5G:</strong> Berkedip hijau saat transmisi data WiFi aktif.</li>
              <li>🟢 <strong>LAN 1-4:</strong> Menyala saat terhubung kabel ethernet ke komputer atau set-top box.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: System / Reboot */}
      {activeTab === 'system' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Manajemen Sistem &amp; Restart (Exabit WiFi)
          </h3>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reboot Router Exabit</h4>
                <p className="text-xs text-slate-400">
                  Mulai ulang modem/router untuk me-refresh koneksi fiber optik dan membersihkan cache DHCP.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReboot}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Mulai Ulang (Reboot) Router Exabit Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
