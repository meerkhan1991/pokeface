import React, { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Examining observable visual styling and colors...',
  'Noticing hairstyle and expressive smile vibes...',
  'Comparing with curated Pokémon visual profiles...',
  'Fetching verified Pokédex artwork from PokéAPI...',
  'Preparing your personalized lookalike reveal!'
];

export const LoadingState: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);

    const timerInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 text-center py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Animated Pokéball Spinner */}
        <div className="w-20 h-20 mx-auto mb-6 relative animate-bounce">
          <div className="w-20 h-20 rounded-full border-4 border-slate-900 bg-red-600 relative overflow-hidden shadow-xl shadow-red-600/20">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white"></div>
            <div className="absolute inset-x-0 top-[45%] h-[10%] bg-slate-900"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white border-4 border-slate-900 shadow animate-pulse"></div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white font-display mb-2">
          Finding Your Lookalike...
        </h3>

        <p className="text-sm text-slate-300 font-medium min-h-[44px] flex items-center justify-center px-4 transition-all duration-300">
          {LOADING_STEPS[stepIndex]}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? 'w-6 bg-red-500' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Slow response reassuring notice */}
        {secondsElapsed > 7 && (
          <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800">
            AI visual reasoning takes a few seconds. Thanks for your patience!
          </p>
        )}
      </div>
    </div>
  );
};
