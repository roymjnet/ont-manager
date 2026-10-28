import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Wifi,
  KeyRound,
  Users,
  RefreshCw,
  Activity,
  Zap,
  HelpCircle,
  Trash2,
  Minimize2,
  Eraser
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onTriggerAction: (actionType: string, payload?: any) => void;
  onDeleteMessage?: (id: string) => void;
  onClearMessages?: () => void;
  onCloseChat?: () => void;
  isMobileCompact?: boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  messages,
  onSendMessage,
  onTriggerAction,
  onDeleteMessage,
  onClearMessages,
  onCloseChat,
  isMobileCompact = false
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const QUICK_PROMPTS = [
    { label: '🔑 Ganti Sandi WiFi', query: 'ganti sandi WiFi' },
    { label: '⚡ Buka Panel Otomatis', query: 'buka panel ont otomatis' },
    { label: '👥 Cek Pengguna WiFi', query: 'cek siapa saja yang pakai wifi' },
    { label: '🔄 Restart Router', query: 'restart router zte f670l' },
    { label: '📊 Cek Redaman Optik', query: 'cek status redaman optik pon' },
    { label: '❓ Lupa Kredensial', query: 'apa username dan password default zte f670l' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 min-h-0 relative select-none">
      {/* Top Header of Chat Panel */}
      <div className="h-10 px-3.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Asisten WiFi Exabit</span>
          <span className="text-[10px] text-slate-500 font-mono">({messages.length} pesan)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onClearMessages && messages.length > 0 && (
            <button
              type="button"
              onClick={onClearMessages}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
              title="Hapus / Bersihkan semua pesan chat"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus Chat</span>
            </button>
          )}

          {onCloseChat && (
            <button
              type="button"
              onClick={onCloseChat}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Sembunyikan Panel Chat (Layar Penuh ONT)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-400">
              <Bot className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-slate-400 mb-1">Pesan chat kosong</p>
            <p className="text-[11px] text-slate-500 max-w-xs mb-4">
              Ketik &quot;ganti sandi WiFi&quot; atau pilih salah satu tombol pintas di bawah untuk mulai berinteraksi.
            </p>
            <button
              onClick={() => onSendMessage('ganti sandi WiFi')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition"
            >
              🔑 Ganti Sandi WiFi Sekarang
            </button>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 group ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs'
                    : 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm relative group/bubble ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  {/* Delete individual message button */}
                  {onDeleteMessage && (
                    <button
                      type="button"
                      onClick={() => onDeleteMessage(msg.id)}
                      className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover/bubble:opacity-100 transition ${
                        msg.sender === 'user'
                          ? 'text-cyan-200 hover:text-white hover:bg-cyan-700'
                          : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                      }`}
                      title="Hapus pesan ini"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Embedded action button if attached */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
                      {msg.action.type === 'countdown-ont' && (
                        <button
                          onClick={() => onTriggerAction('open-ont-wlan')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Buka Menu WLAN Sekarang</span>
                        </button>
                      )}
                      {msg.action.type === 'show-credentials' && (
                        <button
                          onClick={() => onTriggerAction('autofill-credentials')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Gunakan Kredensial Ini</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp & Quick Delete on hover */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </span>
                  {onDeleteMessage && (
                    <button
                      type="button"
                      onClick={() => onDeleteMessage(msg.id)}
                      className="text-[10px] text-slate-600 hover:text-rose-400 transition"
                      title="Hapus pesan"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(qp.query)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition shrink-0 whitespace-nowrap"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder='Ketik pesan, misal: "ganti sandi WiFi"...'
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
