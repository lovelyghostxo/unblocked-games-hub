import React from 'react';
import { 
  Gamepad2, 
  Search, 
  X, 
  Heart, 
  History, 
  FileJson, 
  PlusCircle, 
  ShieldAlert, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export const Header = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  totalGames,
  favoritesCount,
  recentCount,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenCloakModal,
  isCloaked,
  theme,
  setTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0b0e14]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchTerm('');
              }}
              className="group flex items-center gap-3 text-left transition-all hover:opacity-95"
              id="header-logo-btn"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-2 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/35 transition-all">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wider text-slate-100">
                    UNBLOCKED
                  </span>
                  <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[11px] font-extrabold text-indigo-400 border border-indigo-500/30">
                    HUB
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 tracking-tight">
                  {totalGames} Playable Games • Instant Iframe JSON
                </p>
              </div>
            </button>

            {/* Mobile Cloak Trigger */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenCloakModal}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                  isCloaked
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-[#111622] text-slate-300 hover:bg-slate-800'
                }`}
                title="Cloak / Panic Mode"
                id="header-cloak-btn-mobile"
              >
                <ShieldAlert className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search Box Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search games, categories, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800/90 bg-[#111622] py-2 pl-10 pr-9 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500/80 focus:bg-[#151b2a] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                id="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  id="search-clear-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            
            {/* Quick Favorites Nav */}
            <button
              onClick={() => setActiveCategory('Favorites')}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === 'Favorites'
                  ? 'border-pink-500/50 bg-pink-500/15 text-pink-300'
                  : 'border-slate-800/90 bg-[#111622] text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
              id="favorites-nav-btn"
            >
              <Heart className="h-3.5 w-3.5 text-pink-400" />
              <span>Favs</span>
              {favoritesCount > 0 && (
                <span className="rounded-full bg-pink-500/25 px-1.5 py-0.2 text-[10px] font-bold text-pink-200">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Quick Recent Nav */}
            <button
              onClick={() => setActiveCategory('Recently Played')}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === 'Recently Played'
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                  : 'border-slate-800/90 bg-[#111622] text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
              id="recent-nav-btn"
            >
              <History className="h-3.5 w-3.5 text-indigo-400" />
              <span>Recent</span>
              {recentCount > 0 && (
                <span className="rounded-full bg-indigo-500/25 px-1.5 py-0.2 text-[10px] font-bold text-indigo-200">
                  {recentCount}
                </span>
              )}
            </button>

            {/* View JSON Source File Button */}
            <button
              onClick={onOpenJsonModal}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
              title="View & Edit Underlying games.json"
              id="json-file-btn"
            >
              <FileJson className="h-3.5 w-3.5 text-purple-400" />
              <span>games.json</span>
            </button>

            {/* Add Custom Game Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
              id="add-custom-game-btn"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Game</span>
            </button>

            {/* Cloak / Disguise Button */}
            <button
              onClick={onOpenCloakModal}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isCloaked
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-slate-800/90 bg-[#111622] text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
              title="Cloak tab as Google Classroom / Google Docs"
              id="cloak-nav-btn"
            >
              <ShieldAlert className={`h-3.5 w-3.5 ${isCloaked ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isCloaked ? 'Cloaked' : 'Disguise'}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
