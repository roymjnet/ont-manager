import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Download, Shield, Laptop, Smartphone } from 'lucide-react';

interface ElectronGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ElectronGuideModal: React.FC<ElectronGuideModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'bat' | 'main' | 'package'>('bat');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const BATCH_SCRIPT = `@echo off
cd /d "%~dp0"
echo Asisten WiFi Exabit - ZTE F670L
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js belum terpasang. Instal Node.js LTS dari https://nodejs.org lalu jalankan file ini lagi.
  pause
  exit /b 1
)
if not exist node_modules\\electron\\dist\\electron.exe (
  echo Mengunduh dependensi Electron. Perlu koneksi internet pada proses pertama...
  call npm install
  if errorlevel 1 (echo Instalasi gagal. Periksa koneksi internet dan coba lagi. & pause & exit /b 1)
)
call npm start`;

  const MAIN_JS = `const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 402,
    height: 874,
    minWidth: 360,
    minHeight: 640,
    resizable: true,
    title: 'Asisten WiFi Exabit — ZTE F670L',
    backgroundColor: '#0b1020',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Muat antarmuka aplikasi lokal
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Tangani navigasi link eksternal dengan aman
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('http://192.168.1.1') && !url.startsWith('https://192.168.1.1')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

  const PACKAGE_JSON = `{
  "name": "asisten-wifi-exabit-zte-f670l",
  "version": "1.0.0",
  "description": "Asisten WiFi Exabit desktop untuk integrasi panel ONT ZTE F670L",
  "main": "main.js",
  "private": true,
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^36.3.1"
  }
}`;

  const currentCode = activeTab === 'bat' ? BATCH_SCRIPT : activeTab === 'main' ? MAIN_JS : PACKAGE_JSON;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Kode berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Paket Native PC (Windows) & HP (Web/PWA)</h3>
              <p className="text-[11px] text-slate-400">File konfigurasi Electron & skrip launcher otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('bat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'bat' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            JALANKAN_WINDOWS.bat
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'main' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            main.js (Electron)
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'package' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            package.json
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap leading-relaxed">{currentCode}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Kredensial otomatis terisolasi secara aman</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode File Ini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
