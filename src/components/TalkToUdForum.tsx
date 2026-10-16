import React from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, Sparkles, Users, HelpCircle } from 'lucide-react';

interface TalkToUdForumProps {
  onBackToMatch?: () => void;
}

export const TalkToUdForum: React.FC<TalkToUdForumProps> = ({ onBackToMatch }) => {
  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://pokelook.app';

  const disqusShortname = 'poke-5';

  const disqusConfig = {
    url: `${currentOrigin}/talk-to-ud`,
    identifier: 'pokelook-talk-to-ud',
    title: 'PokéLook – Talk to UD Community Discussion',
    language: 'en'
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
          Talk to UD
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
              url: disqusConfig.url,
              identifier: disqusConfig.identifier,
              title: disqusConfig.title
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
            Have questions or issues with photo matching? Leave a note and talk to UD directly.
          </p>
        </div>
      </div>

      {/* Disqus Discussion Embed Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden min-h-[480px]">
        <div className="border-b border-slate-800 pb-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-bold text-white font-display">Live Disqus Discussion</span>
          </div>
          <span className="text-xs text-slate-400">
            Powered by Disqus · Forum ID: poke-5
          </span>
        </div>

        {/* Embedded Disqus Forum */}
        <div className="disqus-container bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/5">
          <DiscussionEmbed
            shortname={disqusShortname}
            config={{
              url: disqusConfig.url,
              identifier: disqusConfig.identifier,
              title: disqusConfig.title,
              language: 'en'
            }}
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
