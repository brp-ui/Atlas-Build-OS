import React from 'react';
import { WidgetConfig } from '../schema/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIWidgetProps {
  config: WidgetConfig;
  data: any;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ config, data }) => {
  const kpiConfig = config.kpiConfig;
  if (!kpiConfig || !data) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-sm">
        KPI Data Unavailable
      </div>
    );
  }

  const value = data[kpiConfig.metricKey];
  const target = kpiConfig.target;

  let formattedVal: string | number = value;
  if (kpiConfig.isCurrency && typeof value === 'number') {
    formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  } else if (kpiConfig.isPercent && typeof value === 'number') {
    formattedVal = `${value.toFixed(1)}%`;
  }

  let formattedTarget: string | number | undefined = target;
  if (target !== undefined) {
    if (kpiConfig.isCurrency) {
      formattedTarget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(target);
    } else if (kpiConfig.isPercent) {
      formattedTarget = `${target.toFixed(1)}%`;
    }
  }

  // Calculate Status color
  let statusColorClass = 'border-slate-800 text-emerald-400';
  if (kpiConfig.statusThreshold && typeof value === 'number') {
    if (value < kpiConfig.statusThreshold.critical) {
      statusColorClass = 'border-rose-900/50 bg-rose-950/20 text-rose-400';
    } else if (value < kpiConfig.statusThreshold.warning) {
      statusColorClass = 'border-amber-900/50 bg-amber-950/20 text-amber-400';
    }
  }

  return (
    <div className={`p-4 bg-slate-900 border rounded-xl flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors ${statusColorClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{config.title}</span>
        {kpiConfig.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
        {kpiConfig.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-400" />}
        {kpiConfig.trend === 'neutral' && <Minus className="w-4 h-4 text-slate-400" />}
      </div>

      <div className="my-2">
        <div className="text-2xl font-bold tracking-tight text-white">{formattedVal}</div>
        {target !== undefined && (
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Target:</span>
            <span className="font-medium text-slate-300">{formattedTarget}</span>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 font-mono">
        Metric ID: {kpiConfig.metricKey}
      </div>
    </div>
  );
};
