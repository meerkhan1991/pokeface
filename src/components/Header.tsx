import React from 'react';
import { Sparkles, RotateCcw, MessageSquare, Camera } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
  activeTab: 'match' | 'talk-to-ud';
  onTabChange: (tab: 'match' | 'talk-to-ud') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  showReset,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer"
          onClick={() => {
            onTabChange('match');
            if (onReset) onReset();
          }}
        >
          <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-md shadow-red-500/20 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white"></div>
            <div className="absolute inset-x-0 top-[45%] h-[10%] bg-slate-900"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-900 z-10"></div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-display whitespace-nowrap">
            PokéLook
          </span>
        </div>

        {/* Zone 2: Navigation Tabs & Links */}
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
          {/* Segmented Primary Tabs: Match & Talk to Us */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => onTabChange('match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'match'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Match</span>
            </button>
            <button
              onClick={() => onTabChange('talk-to-ud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'talk-to-ud'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to Us</span>
            </button>
          </div>

          <a
            href="#how-it-works"
            onClick={() => onTabChange('match')}
            className="hidden md:inline text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0 text-xs font-semibold"
          >
            How It Works
          </a>
          <a
            href="#privacy"
            onClick={() => onTabChange('match')}
            className="hidden md:inline text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0 text-xs font-semibold"
          >
            Privacy
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {showReset && activeTab === 'match' ? (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-full whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fun Match</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
