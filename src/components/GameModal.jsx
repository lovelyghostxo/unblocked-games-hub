import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  RefreshCw, 
  Heart, 
  ExternalLink, 
  Tv2, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  Gamepad2, 
  Info, 
  AlertTriangle,
  Share2,
  Copy,
  Check
} from 'lucide-react';

export const GameModal = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  userRating,
  onRateGame,
}) => {
  if (!game) return null;

  const [useFallback, setUseFallback] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [personalHighScore, setPersonalHighScore] = useState('');
  const iframeRef = useRef(null);

  // Load personal score note from localStorage
  useEffect(() => {
    if (game) {
      const saved = localStorage.getItem(`unblocked_score_${game.id}`) || '';
      setPersonalHighScore(saved);
      setUseFallback(false);
      setIsLoading(true);
    }
  }, [game]);

  const handleSaveScore = (val) => {
    setPersonalHighScore(val);
    localStorage.setItem(`unblocked_score_${game.id}`, val);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  const handleToggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handlePopoutNewTab = () => {
    const url = game.iframeUrl;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePopoutAboutBlank = () => {
    // Open in cloaked about:blank window
    const win = window.open('about:blank', '_blank');
    if (win) {
      win.document.title = game.title;
      win.document.body.style.margin = '0';
      win.document.body.style.height = '100vh';
      win.document.body.style.backgroundColor = '#000';
      
      const iframe = win.document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      if (useFallback && game.fallbackHtml) {
        iframe.srcdoc = game.fallbackHtml;
      } else {
        iframe.src = game.iframeUrl;
      }
      
      win.document.body.appendChild(iframe);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container Box */}
      <div 
        className={`relative flex flex-col w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 my-auto ${
          isTheaterMode 
            ? 'max-w-[98vw] h-[95vh]' 
            : 'max-w-5xl max-h-[92vh]'
        }`}
        id={`modal-container-${game.id}`}
      >
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/70 rounded-t-2xl">
          
          {/* Game Title & Category */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-100 line-clamp-1">{game.title}</h2>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  {game.category}
                </span>
                {useFallback && (
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Safe Canvas Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Refresh Frame */}
            <button
              onClick={handleRefresh}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Reload Game Frame"
              id="game-modal-refresh-btn"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                isFavorite
                  ? 'border-pink-500/50 bg-pink-500/20 text-pink-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Favorite Game"
              id="game-modal-fav-btn"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                isTheaterMode
                  ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Theater Mode"
              id="game-modal-theater-btn"
            >
              <Tv2 className="h-4 w-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Fullscreen Mode"
              id="game-modal-fullscreen-btn"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* About:Blank Popout */}
            <button
              onClick={handlePopoutAboutBlank}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
              title="Open in unblocked about:blank tab"
              id="game-modal-blank-popout-btn"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Cloaked Tab</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition ml-2"
              title="Close Player"
              id="game-modal-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Iframe Viewer Stage */}
        <div className="relative flex-1 bg-black min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden flex items-center justify-center">
          
          {/* Loading Overlay Spinner */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-3" />
              <p className="text-sm font-semibold text-slate-200">Loading Game Iframe...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to JSON game source</p>
            </div>
          )}

          {/* Actual Embedded Iframe */}
          <iframe
            ref={iframeRef}
            src={useFallback ? undefined : game.iframeUrl}
            srcDoc={useFallback ? game.fallbackHtml : undefined}
            title={game.title}
            className="h-full w-full border-0"
            allow="autoplay; gamepad; fullscreen; keyboard"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            id="active-game-iframe"
          />
        </div>

        {/* Bottom Game Details Footer Controls */}
        <div className="border-t border-slate-800 bg-slate-950/90 p-4 rounded-b-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            
            {/* Info & Controls */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
                <Info className="h-4 w-4" />
                <span>Controls & How to Play:</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                {game.controls}
              </p>
            </div>

            {/* Quick Actions & Notes */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Fallback Engine Switcher */}
              {game.fallbackHtml && (
                <button
                  onClick={() => {
                    setUseFallback(!useFallback);
                    setIsLoading(true);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    useFallback
                      ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Switch between external iframe and built-in offline engine"
                  id="game-modal-engine-switch-btn"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>{useFallback ? 'Using Offline Engine' : 'Frame Blocked? Click Here'}</span>
                </button>
              )}

              {/* Likes & Ratings */}
              <div className="flex items-center gap-1 border border-slate-800 bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => onRateGame(game.id, 'like')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    userRating === 'like'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="rate-like-btn"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => onRateGame(game.id, 'dislike')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    userRating === 'dislike'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="rate-dislike-btn"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Share Copy */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                id="share-link-btn"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Link' : 'Share'}</span>
              </button>

              {/* Highscore Note */}
              <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">My Highscore:</span>
                <input
                  type="text"
                  placeholder="e.g. 2048"
                  value={personalHighScore}
                  onChange={(e) => handleSaveScore(e.target.value)}
                  className="w-20 bg-transparent text-xs font-bold text-indigo-300 border-b border-indigo-500/30 focus:border-indigo-400 focus:outline-none"
                  id="highscore-input"
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
