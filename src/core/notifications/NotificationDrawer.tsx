import React from 'react';
import { SystemNotification, NotificationQueue } from './queue';
import { Bell, X, Check, ArrowUpRight, AlertTriangle, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  workspaceId: string;
  queue: NotificationQueue;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  workspaceId,
  queue,
  onClose,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const notifications = queue.getNotificationsForWorkspace(workspaceId);

  const handleStatusChange = (id: string, status: SystemNotification['status']) => {
    queue.updateStatus(id, status);
    onRefresh();
  };

  const handleEscalate = (id: string) => {
    queue.escalateNotification(id);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-950 border border-rose-800/60 rounded-xl text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Central Notification Triage Queue</h3>
              <p className="text-[11px] text-slate-400">Unified alert center across automation, AI, and RFIs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">No active alerts for this workspace</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                  notif.priority === 'critical'
                    ? 'bg-rose-950/30 border-rose-900/60 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                      notif.priority === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {notif.priority}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Level {notif.escalationLevel} Escalation
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{notif.message}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleStatusChange(notif.id, 'resolved')}
                    className="flex-1 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                  </button>

                  <button
                    onClick={() => handleEscalate(notif.id)}
                    className="py-1 px-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-semibold rounded transition-colors"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500 text-center">
          Atlas Operating Queue Enforcement
        </div>
      </div>
    </div>
  );
};
