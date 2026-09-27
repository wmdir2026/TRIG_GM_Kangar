import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50/95 border-emerald-200 text-emerald-950',
    error: 'bg-rose-50/95 border-rose-200 text-rose-950',
    warning: 'bg-amber-50/95 border-amber-200 text-amber-950',
    info: 'bg-blue-50/95 border-blue-200 text-blue-950'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm pointer-events-none">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md font-medium text-xs sm:text-sm ${
          bgColors[toast.type] || bgColors.success
        }`}
      >
        <div className="shrink-0">{icons[toast.type] || icons.success}</div>
        <p className="leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
