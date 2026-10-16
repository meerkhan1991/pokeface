import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, onRetry }) => {
  if (!message) return null;

  const isKeyError = message.toLowerCase().includes('key not configured') || message.toLowerCase().includes('api key');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 flex items-center justify-center mx-auto mb-3.5 text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white font-display mb-1.5">
          {isKeyError ? 'API Key Configuration Needed' : 'Unable to Complete Match'}
        </h3>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
