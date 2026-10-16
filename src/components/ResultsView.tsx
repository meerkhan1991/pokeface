import React, { useState } from 'react';
import { Share2, Download, Copy, Check, RotateCcw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PokemonApiData, PokemonMatchResult } from '../services/api';
import { generateResultCard } from '../services/cardGenerator';

interface ResultsViewProps {
  matchResult: PokemonMatchResult;
  pokemonData: PokemonApiData;
  userPhotoUrl: string | null;
  onTryAgain: () => void;
  onSelectAlternative?: (altPokemonName: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  matchResult,
  pokemonData,
  userPhotoUrl,
  onTryAgain,
  onSelectAlternative
}) => {
  const [includeUserPhoto, setIncludeUserPhoto] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedAltIndex, setSelectedAltIndex] = useState<number | null>(null);

  const { bestMatch, alternativeMatches, visualReasons, explanation } = matchResult;

  // Share text
  const shareText = `I just found out my Pokémon lookalike is ${pokemonData.displayName} (#${pokemonData.id}) on PokéLook! ✨ Discover yours: ${window.location.origin}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Pokémon Lookalike is ${pokemonData.displayName}!`,
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy text
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      const cardDataUrl = await generateResultCard(
        matchResult,
        pokemonData,
        includeUserPhoto,
        userPhotoUrl
      );
      const link = document.createElement('a');
      link.download = `pokelook-${pokemonData.name}-match.png`;
      link.href = cardDataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate result card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Styling Match Complete</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
          Your Pokémon Lookalike Is...
        </h2>
      </div>

      {/* Main Pokémon Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden mb-6">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Comparison Layout or Single Showcase */}
        {includeUserPhoto && userPhotoUrl ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* User Photo Box */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex flex-col justify-end">
              <img
                src={userPhotoUrl}
                alt="Your photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 bg-slate-900/80 backdrop-blur-md py-1.5 px-2 text-center border-t border-white/10">
                <span className="text-xs font-semibold text-slate-200">Your Photo</span>
              </div>
            </div>

            {/* Pokémon Artwork Box */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-950 border border-slate-700/60 shadow-md flex flex-col justify-end p-2 items-center">
              <img
                src={pokemonData.artworkUrl}
                alt={pokemonData.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2 drop-shadow-xl animate-in zoom-in-95 duration-300"
              />
              <div className="relative z-10 w-full bg-slate-900/80 backdrop-blur-md py-1.5 px-2 text-center rounded-xl border border-white/10">
                <span className="text-xs font-bold text-amber-400">
                  {pokemonData.displayName}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3] max-w-sm mx-auto rounded-2xl bg-gradient-to-b from-slate-800/40 via-slate-850 to-slate-950 border border-slate-800 flex items-center justify-center p-4 mb-5 shadow-inner">
            <img
              src={pokemonData.artworkUrl}
              alt={pokemonData.displayName}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-2xl animate-in zoom-in-90 duration-300"
            />
          </div>
        )}

        {/* Pokémon Identity Title & Pokédex Info */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              {pokemonData.displayName}
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
              #{pokemonData.id}
            </span>
          </div>

          {/* Types as clean unboxed text metadata */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {pokemonData.types.map((type, i) => (
              <React.Fragment key={type}>
                {i > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
                <span className="text-amber-400/90">{type}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Narrative Explanation */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-5 text-sm text-slate-200 leading-relaxed text-center">
          "{explanation}"
        </div>

        {/* Three Visual Reasons for the Match */}
        <div className="mb-6">
          <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 text-center sm:text-left">
            Why This Match Fits Your Style
          </h4>
          <div className="space-y-2.5">
            {visualReasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle to include user's photo alongside Pokémon */}
        {userPhotoUrl && (
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Show my photo alongside Pokémon</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeUserPhoto}
                onChange={(e) => setIncludeUserPhoto(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        )}
      </div>

      {/* Two Alternative Matches Section */}
      {alternativeMatches && alternativeMatches.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Alternative Style Matches
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {alternativeMatches.slice(0, 2).map((alt, idx) => (
              <button
                key={alt.id}
                onClick={() => {
                  setSelectedAltIndex(idx);
                  if (onSelectAlternative) {
                    onSelectAlternative(alt.name);
                  }
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden p-1">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${alt.id}.png`}
                    alt={alt.displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate font-display">
                    {alt.displayName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    #{alt.id} · {alt.types[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleDownloadCard}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Generating Card...' : 'Download Card'}</span>
        </button>

        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>
        ) : (
          <button
            onClick={handleCopyText}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm border border-slate-700 transition-colors"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Result Text'}</span>
          </button>
        )}

        <button
          onClick={onTryAgain}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-750 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>

      {/* Mandatory Entertainment & Non-Biometric Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 leading-relaxed">
        Just for fun! This result is based on visual styling and expression, not a scientific assessment.
      </div>
    </div>
  );
};
