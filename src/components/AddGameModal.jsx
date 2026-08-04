import React, { useState } from 'react';
import { X, PlusCircle, Link, Image, Gamepad2, Sparkles, FileText } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [embedType, setEmbedType] = useState('url');
  const [customHtml, setCustomHtml] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      iframeUrl: embedType === 'url' ? iframeUrl.trim() || 'about:blank' : 'about:blank',
      fallbackHtml: embedType === 'html' ? customHtml : undefined,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      description: description.trim() || 'User added unblocked game iframe.',
      controls: controls.trim() || 'Use Keyboard and Mouse to play.',
      rating: 5.0,
      plays: 1,
      featured: false,
      tags: ['Custom', category],
      author: 'User',
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();

    // Reset form
    setTitle('');
    setIframeUrl('');
    setCustomHtml('');
    setThumbnail('');
    setDescription('');
    setControls('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Add Custom Iframe Game</h2>
              <p className="text-xs text-slate-400">Embed any website or playable iframe directly into your list</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            id="add-modal-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Game Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. My Favorite Runner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="add-game-title-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="add-game-category-select"
            >
              <option value="Arcade">Arcade</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Action">Action</option>
              <option value="Sports">Sports</option>
              <option value="Strategy">Strategy</option>
              <option value="Retro">Retro</option>
              <option value="Driving">Driving</option>
              <option value="Casual">Casual</option>
            </select>
          </div>

          {/* Embed Mode Switcher */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Embed Source *
              </label>
              <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setEmbedType('url')}
                  className={`rounded-md px-2.5 py-1 transition ${
                    embedType === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                  id="embed-mode-url-btn"
                >
                  Iframe URL
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedType('html')}
                  className={`rounded-md px-2.5 py-1 transition ${
                    embedType === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                  id="embed-mode-html-btn"
                >
                  Custom HTML Embed
                </button>
              </div>
            </div>

            {embedType === 'url' ? (
              <input
                type="url"
                required
                placeholder="https://example.com/embed-game"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                id="add-game-url-input"
              />
            ) : (
              <textarea
                required
                rows={3}
                placeholder="<!DOCTYPE html><html><body><h1>My Game</h1></body></html>"
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-mono text-indigo-300 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                id="add-game-html-input"
              />
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Thumbnail Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="add-game-thumb-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Description & Controls
            </label>
            <input
              type="text"
              placeholder="Controls (e.g. Arrow keys to move)"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="add-game-controls-input"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              id="add-game-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition"
              id="add-game-submit-btn"
            >
              Save Custom Game
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
