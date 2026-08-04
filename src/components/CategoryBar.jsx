import React from 'react';
import { 
  Grid, 
  Sparkles, 
  Heart, 
  History, 
  Gamepad2, 
  Puzzle, 
  Zap, 
  Trophy, 
  Compass, 
  Gamepad, 
  Car, 
  Coffee 
} from 'lucide-react';
import { CATEGORIES } from '../types.js';

const CATEGORY_ICONS = {
  All: Grid,
  Featured: Sparkles,
  Favorites: Heart,
  'Recently Played': History,
  Arcade: Gamepad2,
  Puzzle: Puzzle,
  Action: Zap,
  Sports: Trophy,
  Strategy: Compass,
  Retro: Gamepad,
  Driving: Car,
  Casual: Coffee,
};

export const CategoryBar = ({
  activeCategory,
  setActiveCategory,
  categoryCounts,
}) => {
  return (
    <div className="border-b border-slate-800/80 bg-[#0b0e14]/60 py-2.5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat] || Grid;
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group flex whitespace-nowrap items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-1 ring-white/15'
                    : 'bg-[#111622] text-slate-300 border border-slate-800/80 hover:border-slate-700 hover:bg-[#161c2b] hover:text-white'
                }`}
                id={`category-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800/90 text-slate-400 group-hover:bg-slate-700/80 group-hover:text-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
