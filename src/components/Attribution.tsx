import React from 'react';

export const Attribution: React.FC = () => {
  return (
    <footer id="about" className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
      <div className="max-w-xl mx-auto space-y-2">
        <p className="font-medium text-slate-400">
          Pokémon data: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline hover:text-slate-200">PokéAPI</a>
        </p>
        <p className="leading-relaxed">
          This is an unofficial educational fan project and is not affiliated with or endorsed by Pokémon or its rights holders.
        </p>
        <p className="text-[11px] text-slate-600 pt-2">
          PokéLook · Powered by Gemini Vision & React
        </p>
      </div>
    </footer>
  );
};
