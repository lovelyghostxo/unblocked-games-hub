import React from 'react';
import { X, ShieldAlert, Check, ExternalLink, Globe } from 'lucide-react';
import { CLOAK_PRESETS } from '../data/cloaks.js';

export const PanicCloakModal = ({
  isOpen,
  onClose,
  activeCloakId,
  isCloaked,
  onSelectCloak,
  onToggleCloak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Tab Disguise & Cloak</h2>
              <p className="text-xs text-slate-400">Mask tab title & favicon for unblocked privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            id="cloak-modal-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toggle Cloak Master Switch */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
          <div>
            <span className="text-sm font-bold text-slate-200 block">Enable Tab Cloaking</span>
            <span className="text-xs text-slate-400">Replaces document title & favicon in browser</span>
          </div>
          <button
            onClick={() => onToggleCloak(!isCloaked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isCloaked ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
            id="cloak-master-toggle-btn"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isCloaked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Preset Selection List */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Select Cloak Disguise Preset:
          </label>
          <div className="space-y-2">
            {CLOAK_PRESETS.map((preset) => {
              const isSelected = activeCloakId === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectCloak(preset.id);
                    if (!isCloaked) onToggleCloak(true);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    isSelected && isCloaked
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  id={`cloak-preset-${preset.id}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.favicon}
                      alt={preset.name}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <span className="text-xs font-bold block">{preset.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 block line-clamp-1">{preset.title}</span>
                    </div>
                  </div>

                  {isSelected && isCloaked && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Key Notice */}
        <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-300 flex items-start gap-2.5">
          <Globe className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
          <div>
            <span className="font-bold block text-indigo-200">Emergency Panic Redirect</span>
            <span>Press <kbd className="rounded bg-indigo-950 px-1.5 py-0.5 font-mono text-[10px] text-indigo-300 border border-indigo-500/40">Esc</kbd> anytime to instantly hide games and redirect tab to Google.com.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
