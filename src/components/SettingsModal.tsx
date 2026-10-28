import React, { useState } from 'react';
import { X, Server, KeyRound, Shield, Check, RotateCcw } from 'lucide-react';
import { OntState } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ontState: OntState;
  setOntState: React.Dispatch<React.SetStateAction<OntState>>;
  onNotify: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  ontState,
  setOntState,
  onNotify
}) => {
  if (!isOpen) return null;

  const [ip, setIp] = useState(ontState.ipAddress);
  const [user, setUser] = useState(ontState.username);
  const [pass, setPass] = useState(ontState.password);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOntState(prev => ({
      ...prev,
      ipAddress: ip.trim(),
      username: user.trim(),
      password: pass.trim()
    }));
    onNotify('Pengaturan router & kredensial berhasil disimpan!');
    onClose();
  };

  const handleResetToDefault = () => {
    setIp('192.168.1.1');
    setUser('user');
    setPass('User23456');
    onNotify('Kredensial direset ke default (user / User23456)');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Pengaturan Router & Kredensial</h3>
              <p className="text-[11px] text-slate-400">Sesuaikan IP Gateway & akun login Exabit WiFi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* IP Gateway */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              IP Gateway ONT
            </label>
            <input
              type="text"
              value={ip}
              onChange={e => setIp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              placeholder="192.168.1.1"
            />
            <span className="text-[10px] text-slate-500 mt-1 block font-mono">
              Default: 192.168.1.1 (Exabit Fiber)
            </span>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="text"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Default Reset Option */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset ke Default (user / User23456)</span>
            </button>
          </div>

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
