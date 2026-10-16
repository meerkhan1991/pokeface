import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-md shadow-red-500/20 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white"></div>
            <div className="absolute inset-x-0 top-[45%] h-[10%] bg-slate-900"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-900 z-10"></div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-display whitespace-nowrap">
            PokéLook
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <a href="#privacy" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Privacy
          </a>
          <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            About
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {showReset ? (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-full whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fun Match</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
