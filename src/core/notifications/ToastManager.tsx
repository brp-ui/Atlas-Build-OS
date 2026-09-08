import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([
    {
      id: 't-1',
      title: 'Atlas AI Monitoring Active',
      message: 'Autonomous risk engines checking Youngman & Century margins.',
      type: 'info',
    },
  ]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          title: 'WIP Revenue Auto-Calculated',
          message: 'Oakridge Expansion gross profit locked at 26.8% GM.',
          type: 'success',
        },
      ]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white">{toast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">{toast.message}</p>
          </div>

          <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
