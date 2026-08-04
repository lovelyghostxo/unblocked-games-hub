import React, { useState } from 'react';
import { Star, Eye, Heart, Play, Sparkles, User, ExternalLink } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111622] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-[#161d2d] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
      id={`game-card-${game.id}`}
    >
      {/* Thumbnail Aspect Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b0e14]">
        {!imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111622] to-[#1e1b4b] p-4 text-center">
            <Sparkles className="h-8 w-8 text-indigo-400 opacity-60 mb-2" />
            <span className="text-sm font-bold text-slate-200">{game.title}</span>
            <span className="text-xs text-slate-400 mt-1">{game.category}</span>
          </div>
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/20 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#0b0e14]/90 px-2 py-0.5 text-[10px] font-bold text-indigo-300 backdrop-blur-md border border-slate-800">
              {game.category}
            </span>
            {game.featured && (
              <span className="flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 backdrop-blur-md">
                <Sparkles className="h-2.5 w-2.5" />
                <span>HOT</span>
              </span>
            )}
            {game.isCustom && (
              <span className="rounded-md bg-purple-500/90 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-md">
                CUSTOM
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'border-pink-500/50 bg-pink-500/30 text-pink-400'
                : 'border-slate-700/60 bg-[#0b0e14]/70 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            id={`fav-btn-${game.id}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>
        </div>

        {/* Hover Play Circle Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950/40 backdrop-blur-[2px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/50 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-6 w-6 fill-white ml-1" />
          </div>
        </div>

        {/* Bottom stats inside image container */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1 text-amber-400 font-bold bg-[#0b0e14]/80 px-2 py-0.5 rounded-md backdrop-blur-md border border-slate-800/60">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 bg-[#0b0e14]/80 px-2 py-0.5 rounded-md backdrop-blur-md border border-slate-800/60">
            <Eye className="h-3 w-3 text-slate-400" />
            <span>{(game.plays / 1000).toFixed(1)}k plays</span>
          </div>
        </div>

      </div>

      {/* Card Info Box */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
          <div className="flex items-center gap-1 overflow-hidden">
            {game.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-800/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          <span className="font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Play Now →
          </span>
        </div>
      </div>

    </div>
  );
};
