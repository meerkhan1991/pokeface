import React, { useEffect, useState, useRef } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, Sparkles, Users, HelpCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface TalkToUdForumProps {
  onBackToMatch?: () => void;
}

export const TalkToUdForum: React.FC<TalkToUdForumProps> = ({ onBackToMatch }) => {
  // Canonical discussion URL based on public site URL (fallback to stable production domain)
  const rawSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://pokelook.vercel.app';
  const siteUrl = rawSiteUrl.replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/talk-to-ud`;
  const threadIdentifier = 'pokelook-talk-to-ud';
  const disqusShortname = 'poke-5';

  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor script loading and provide timeout failure fallback
  useEffect(() => {
    setLoadStatus('loading');

    // 7-second watchdog timer for network blocks, ad blockers, or Disqus domain rejection
    const timeoutId = setTimeout(() => {
      setLoadStatus((current) => {
        if (current === 'loading') {
          // Check if an iframe was actually injected into #disqus_thread
          const threadEl = document.getElementById('disqus_thread');
          const hasIframe = threadEl?.querySelector('iframe');
          return hasIframe ? 'ready' : 'error';
        }
        return current;
      });
    }, 7000);

    // Error listener for third-party script blocks
    const handleScriptError = (event: ErrorEvent) => {
      if (
        event.filename &&
        (event.filename.includes('disqus.com') || event.filename.includes('disquscdn.com'))
      ) {
        setLoadStatus('error');
      }
    };

    window.addEventListener('error', handleScriptError);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('error', handleScriptError);
    };
  }, [retryCount]);

  const handleRetry = () => {
    // Clean residual script if any before retrying
    if (typeof window !== 'undefined') {
      const script = document.getElementById('dsq-embed-scr');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({});
        } catch {
          // ignore
        }
      }
    }
    setLoadStatus('loading');
    setRetryCount((prev) => prev + 1);
  };

  const disqusConfig = {
    url: canonicalUrl,
    identifier: threadIdentifier,
    title: 'PokéLook – Talk to Us Community Discussion',
    language: 'en',
    onReady: () => {
      setLoadStatus('ready');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-semibold mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Discussion Forum</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mb-3">
          Talk to Us
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
          Share your Pokémon lookalikes, leave feedback for the developers, or chat with fellow trainers in our community thread!
        </p>

        {/* Live Comment Count Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">Thread Activity:</span>
          <CommentCount
            shortname={disqusShortname}
            config={{
              url: canonicalUrl,
              identifier: threadIdentifier,
              title: 'PokéLook – Talk to Us Community Discussion'
            }}
          >
            Comments
          </CommentCount>
        </div>
      </div>

      {/* Discussion Topics & Guidelines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Share Your Lookalike</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tell everyone which Pokémon you matched with and how close the expression and colors were!
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <Users className="w-4 h-4" />
            <span>Feature Requests</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Suggest new Pokémon to add to our allowlist catalog or fun styling features you want to see.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Feedback & Support</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Have questions or issues with photo matching? Leave a note and talk to us directly.
          </p>
        </div>
      </div>

      {/* Disqus Discussion Embed Container */}
      <div
        ref={containerRef}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden min-h-[480px] relative"
      >
        <div className="border-b border-slate-800 pb-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                loadStatus === 'ready'
                  ? 'bg-emerald-500'
                  : loadStatus === 'error'
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className="text-sm font-bold text-white font-display">Live Disqus Discussion</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            shortname: {disqusShortname}
          </span>
        </div>

        {/* Loading Spinner Indicator */}
        {loadStatus === 'loading' && (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-slate-300">
              Loading community discussion from Disqus...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Connecting thread <span className="font-mono text-slate-400">{threadIdentifier}</span>
            </p>
          </div>
        )}

        {/* Failure / Fallback State */}
        {loadStatus === 'error' && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-900/40 text-center my-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display mb-1.5">
              Discussion Loading Notice
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
              Unable to load the discussion. Please check your connection or open the forum directly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/25"
              >
                <span>Open Discussion Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://disqus.com/home/forums/${disqusShortname}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Open Forum Directly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-750 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading</span>
              </button>
            </div>
          </div>
        )}

        {/* Embedded Disqus Forum */}
        <div
          className={`disqus-container bg-slate-950/50 rounded-2xl p-4 sm:p-6 border border-white/5 transition-opacity duration-300 ${
            loadStatus === 'loading' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <DiscussionEmbed
            key={`disqus-embed-${retryCount}`}
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      </div>

      {/* Return to Matcher button */}
      {onBackToMatch && (
        <div className="text-center mt-8">
          <button
            onClick={onBackToMatch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            ← Back to Pokémon Lookalike Matcher
          </button>
        </div>
      )}
    </div>
  );
};
