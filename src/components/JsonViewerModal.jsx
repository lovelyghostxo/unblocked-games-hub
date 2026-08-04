import React, { useState } from 'react';
import { X, FileJson, Copy, Check, Download, Upload, Search, Database, Code } from 'lucide-react';

export const JsonViewerModal = ({
  isOpen,
  onClose,
  games,
  onImportGamesJson,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  const [importError, setImportError] = useState('');

  // Format json without heavy fallbackHtml strings if desired for clean viewing
  const jsonOutput = JSON.stringify(
    games.map(({ fallbackHtml, ...rest }) => rest), 
    null, 
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        setImportError('JSON must be an array of game objects.');
        return;
      }
      onImportGamesJson(parsed);
      setActiveTab('view');
      setImportText('');
    } catch (err) {
      setImportError(`Invalid JSON format: ${err?.message || 'Parse error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-purple-500/30 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">games.json Data Store</h2>
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                  {games.length} Iframe Games
                </span>
              </div>
              <p className="text-xs text-slate-400">All games are loaded directly from JSON iframe configurations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                onClick={() => setActiveTab('view')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'view' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                id="json-tab-view-btn"
              >
                View JSON
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'import' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                id="json-tab-import-btn"
              >
                Import JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              id="json-modal-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'view' ? (
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            
            {/* Top Stats & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Source:</span>
                <code className="rounded bg-slate-950 px-2 py-1 text-xs font-mono text-emerald-400 border border-slate-800">
                  /public/games.json
                </code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                  id="json-copy-btn"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-purple-400" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/30 transition"
                  id="json-download-btn"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON File</span>
                </button>
              </div>
            </div>

            {/* Formatted Code Box */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-purple-200 leading-relaxed">
              <pre className="whitespace-pre-wrap">{jsonOutput}</pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Import / Replace games.json Structure</h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste a valid JSON array of game iframe configurations below. Required keys: <code className="text-purple-300">id, title, category, iframeUrl, thumbnail, description</code>
            </p>

            <textarea
              rows={12}
              placeholder='[ { "id": "my-game", "title": "My Custom Game", "category": "Arcade", "iframeUrl": "https://..." } ]'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full flex-1 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-purple-200 placeholder-slate-600 focus:border-purple-500 focus:outline-none"
              id="json-import-textarea"
            />

            {importError && (
              <p className="mt-2 text-xs font-semibold text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {importError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setActiveTab('view')}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                id="json-import-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition"
                id="json-import-submit-btn"
              >
                Load Imported JSON
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
