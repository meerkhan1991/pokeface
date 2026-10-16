import React from 'react';
import { Lock, EyeOff, ShieldAlert, Cpu } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const points = [
    {
      title: 'Zero Permanent Storage',
      desc: 'Your photos are never saved to any database, file server, or localStorage. Images are held ephemerally in volatile memory only during analysis and discarded immediately.',
      icon: EyeOff
    },
    {
      title: 'No Biometrics or Facial Recognition',
      desc: 'We do not generate facial templates, embeddings, or biometric measurements. We do not attempt to identify people, determine age, ethnicity, gender, or rate attractiveness.',
      icon: Lock
    },
    {
      title: 'Explicit Consent & Ephemeral AI',
      desc: 'Your photo is only sent to the Google Gemini vision model after you explicitly tap "Find My Pokémon". Requests and responses are never cached.',
      icon: Cpu
    },
    {
      title: 'Zero Personal Data Collection',
      desc: 'No account, email, phone number, or names are ever collected or requested. PokéLook is purely a client-side entertainment tool.',
      icon: ShieldAlert
    }
  ];

  return (
    <section id="privacy" className="py-12 px-4 max-w-4xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          Privacy & Ethical Guardrails
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          PokéLook is built for lighthearted fun. We take your privacy and personal data seriously.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map((pt, i) => {
          const Icon = pt.icon;
          return (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display mb-1">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
