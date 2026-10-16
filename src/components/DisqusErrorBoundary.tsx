import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  canonicalUrl: string;
  disqusShortname: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class DisqusErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Discussion script error'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Disqus Error Caught]:', error.message, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-amber-900/40 text-center my-4 animate-in fade-in">
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
              href={this.props.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/25"
            >
              <span>Open Discussion Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://disqus.com/home/forums/${this.props.disqusShortname}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>Open Forum Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-750 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
