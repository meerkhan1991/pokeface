import React from 'react';
import { Camera, Sparkles, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Snap or Select',
      description: 'Upload a selfie or snap a photo with your camera. We recommend good lighting and an expressive smile.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Visual Style Analysis',
      description: 'Gemini AI spots playful visual elements—like your dominant colors, hairstyle shape, expression, and accessories.',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'Discover Your Pokémon',
      description: 'We connect your styling cues with curated Pokémon profiles to find your closest lookalike and two fun alternatives!',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-12 px-4 max-w-4xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          How It Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Three simple steps to discover your playful Pokémon match
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-red-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-display mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
