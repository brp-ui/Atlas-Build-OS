import React from 'react';
import { WidgetConfig } from '../schema/types';
import { FileText, AlertCircle, CheckCircle2, Clock, ShieldCheck, Tag } from 'lucide-react';

interface OperationalWidgetProps {
  config: WidgetConfig;
  data: any[];
}

export const OperationalWidget: React.FC<OperationalWidgetProps> = ({ config, data = [] }) => {
  const entityType = config.operationalConfig?.entityType || 'task';

  const getIcon = () => {
    switch (entityType) {
      case 'rfi':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'change_order':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'permit':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'goal':
        return <Tag className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-sm font-semibold text-slate-200">{config.title}</h4>
        </div>
        <span className="text-xs text-slate-400 font-mono">{data.length} records</span>
      </div>

      <div className="space-y-2.5 my-1 overflow-y-auto max-h-60 pr-1">
        {data.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">No pending items in queue</div>
        ) : (
          data.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-200">{item.title || item.question || item.reason}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  {item.rfiNumber && <span>RFI #{item.rfiNumber}</span>}
                  {item.coNumber && <span>CO #{item.coNumber} - ${item.amount}</span>}
                  {item.permitNumber && <span>Permit #{item.permitNumber}</span>}
                  {item.currentValue !== undefined && (
                    <span>Progress: {item.currentValue} / {item.targetValue} {item.unit}</span>
                  )}
                  {item.ballInCourt && <span className="text-amber-400/90 font-mono">Ball: {item.ballInCourt}</span>}
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono shrink-0 uppercase">
                {item.status || item.approvalStatus || 'pending'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
