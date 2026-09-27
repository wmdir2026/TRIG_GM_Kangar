import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Sistem Mengesan Ralat Data</h2>
              <p className="text-xs text-slate-400">
                Penyemak imbas anda mungkin menyimpan data demo lama dalam storan tempatan (localStorage).
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/50 border border-slate-800 rounded-xl text-left text-[11px] font-mono text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleResetStorage}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Set Semula Storan & Buka Portal</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Semula (Reload)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
