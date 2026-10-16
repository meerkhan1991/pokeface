import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="text-center pt-8 pb-4 px-4 max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-semibold mb-5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Entertainment & Styling Match</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-4">
        Which Pokémon Do You Look Like?
      </h1>

      <p className="text-base sm:text-lg text-slate-300 font-medium max-w-lg mx-auto leading-relaxed mb-6">
        Upload a selfie and discover your Pokémon lookalike!
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          No photos stored
        </span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>Visual styling & expression</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>100% Just for fun</span>
      </div>
    </section>
  );
};
