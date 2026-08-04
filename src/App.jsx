import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { CLOAK_PRESETS } from './data/cloaks.js';
import { Header } from './components/Header.jsx';
import { CategoryBar } from './components/CategoryBar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GameModal } from './components/GameModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { PanicCloakModal } from './components/PanicCloakModal.jsx';
import { 
  Gamepad2, 
  FileJson, 
  PlusCircle, 
  ShieldAlert, 
  SearchX, 
  Sparkles, 
  Flame, 
  Heart, 
  History, 
  Zap, 
  Layers,
  Code
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(DEFAULT_GAMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Local persistence states
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unblocked_favorites') || '["2048-classic", "hextris-arcade"]');
    } catch {
      return ["2048-classic", "hextris-arcade"];
    }
  });

  const [recentIds, setRecentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unblocked_recent') || '[]');
    } catch {
      return [];
    }
  });

  const [customGames, setCustomGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unblocked_custom_games') || '[]');
    } catch {
      return [];
    }
  });

  const [ratings, setRatings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unblocked_ratings') || '{}');
    } catch {
      return {};
    }
  });

  // Cloaking states
  const [isCloaked, setIsCloaked] = useState(() => {
    return localStorage.getItem('unblocked_cloaked') === 'true';
  });
  const [activeCloakId, setActiveCloakId] = useState(() => {
    return localStorage.getItem('unblocked_cloak_id') || 'classroom';
  });

  // Modal active states
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Fetch games from ./games.json on mount
  useEffect(() => {
    fetch('./games.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data);
        }
      })
      .catch((err) => {
        console.warn('Using default games dataset, could not fetch /games.json:', err);
      });
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recent to localStorage
  useEffect(() => {
    localStorage.setItem('unblocked_recent', JSON.stringify(recentIds));
  }, [recentIds]);

  // Save custom games
  useEffect(() => {
    localStorage.setItem('unblocked_custom_games', JSON.stringify(customGames));
  }, [customGames]);

  // Save ratings
  useEffect(() => {
    localStorage.setItem('unblocked_ratings', JSON.stringify(ratings));
  }, [ratings]);

  // Save cloaked preference
  useEffect(() => {
    localStorage.setItem('unblocked_cloaked', String(isCloaked));
    localStorage.setItem('unblocked_cloak_id', activeCloakId);

    const preset = CLOAK_PRESETS.find((p) => p.id === activeCloakId) || CLOAK_PRESETS[0];

    if (isCloaked) {
      document.title = preset.title;
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = preset.favicon;
    } else {
      document.title = 'Unblocked Games Hub';
    }
  }, [isCloaked, activeCloakId]);

  // Emergency Panic Key listener (press Escape to redirect or hide)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedGame) {
          setSelectedGame(null);
        } else if (isCloaked) {
          window.location.href = 'https://www.google.com';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame, isCloaked]);

  // All combined games (JSON loaded + Custom user added)
  const allGames = useMemo(() => {
    const combined = [...games];
    // Add custom games if not already present
    customGames.forEach((cg) => {
      if (!combined.some((g) => g.id === cg.id)) {
        combined.unshift(cg);
      }
    });
    return combined;
  }, [games, customGames]);

  // Favorite toggle handler
  const handleToggleFavorite = (e, id) => {
    if (typeof e === 'object' && e.stopPropagation) {
      e.stopPropagation();
    }
    const targetId = typeof e === 'string' ? e : id;
    if (!targetId) return;

    setFavorites((prev) =>
      prev.includes(targetId) ? prev.filter((i) => i !== targetId) : [...prev, targetId]
    );
  };

  // Selecting a game to play
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setRecentIds((prev) => [game.id, ...prev.filter((id) => id !== game.id)]);
  };

  // Add Custom Game
  const handleAddCustomGame = (newGame) => {
    setCustomGames((prev) => [newGame, ...prev]);
    setSelectedGame(newGame);
  };

  // Import JSON Games
  const handleImportGamesJson = (imported) => {
    setGames(imported);
  };

  // Rate Game
  const handleRateGame = (id, rating) => {
    setRatings((prev) => ({
      ...prev,
      [id]: prev[id] === rating ? undefined : rating,
    }));
  };

  // Category Counts calculation
  const categoryCounts = useMemo(() => {
    const counts = {
      All: allGames.length,
      Featured: allGames.filter((g) => g.featured).length,
      Favorites: favorites.length,
      'Recently Played': recentIds.length,
    };

    allGames.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });

    return counts;
  }, [allGames, favorites, recentIds]);

  // Filtered games logic
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      // Category filter
      if (activeCategory === 'Featured' && !game.featured) return false;
      if (activeCategory === 'Favorites' && !favorites.includes(game.id)) return false;
      if (activeCategory === 'Recently Played' && !recentIds.includes(game.id)) return false;
      if (
        activeCategory !== 'All' &&
        activeCategory !== 'Featured' &&
        activeCategory !== 'Favorites' &&
        activeCategory !== 'Recently Played' &&
        game.category !== activeCategory
      ) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesCat = game.category.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesCat || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [allGames, activeCategory, searchTerm, favorites, recentIds]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        totalGames={allGames.length}
        favoritesCount={favorites.length}
        recentCount={recentIds.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        isCloaked={isCloaked}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Category Navigation Bar */}
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Stage */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Active Filter Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{activeCategory} Games</span>
              <span className="rounded-md bg-[#111622] border border-slate-800 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
                {filteredGames.length}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchTerm 
                ? `Showing games matching "${searchTerm}"`
                : `Play unblocked HTML5 & iframe games directly in browser`}
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
              id="view-json-header-badge"
            >
              <FileJson className="h-3.5 w-3.5" />
              <span>Loaded from games.json</span>
            </button>
          </div>
        </div>

        {/* Game Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={handleSelectGame}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#111622]/50 py-16 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111622] text-slate-500 mb-4 border border-slate-800">
              <SearchX className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No games found</h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-6">
              No games matched your active filters or search term "{searchTerm}". Try clearing your search or adding a custom game!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="rounded-xl border border-slate-800 bg-[#111622] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                id="reset-filters-btn"
              >
                Reset Search Filters
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                id="empty-add-game-btn"
              >
                Add Custom Iframe Game
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Banner */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#0b0e14] py-8 text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-300">Unblocked Games Hub</span>
            <span className="text-slate-600">•</span>
            <span>JSON Iframe Repository</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-indigo-400 transition flex items-center gap-1"
            >
              <Code className="h-3.5 w-3.5" />
              <span>Inspect JSON</span>
            </button>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Panic Disguise</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Game Player Iframe Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        isFavorite={selectedGame ? favorites.includes(selectedGame.id) : false}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        userRating={selectedGame ? ratings[selectedGame.id] : undefined}
        onRateGame={handleRateGame}
      />

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />

      {/* JSON File Viewer Modal */}
      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={allGames}
        onImportGamesJson={handleImportGamesJson}
      />

      {/* Cloak / Panic Modal */}
      <PanicCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloakId={activeCloakId}
        isCloaked={isCloaked}
        onSelectCloak={setActiveCloakId}
        onToggleCloak={setIsCloaked}
      />

    </div>
  );
}
