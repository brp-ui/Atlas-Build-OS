import React from 'react';
import { WidgetConfig } from '../schema/types';
import { BarChart3, LineChart, PieChart } from 'lucide-react';

interface ChartWidgetProps {
  config: WidgetConfig;
  data: any[];
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ config, data = [] }) => {
  const chartType = config.chartType || 'bar';

  // Sample SVG Bar / Progress Chart
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-200">{config.title}</h4>
        <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded uppercase font-mono">
          {chartType}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center my-2 space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">No chart series data available</div>
        ) : (
          data.slice(0, 4).map((item, idx) => {
            const label = item.title || item.name || `Series ${idx + 1}`;
            const value = item.contractValue || item.value || item.revenue || (idx + 1) * 250000;
            const maxVal = 1500000;
            const pct = Math.min(100, Math.round((value / maxVal) * 100));

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="truncate max-w-[200px]">{label}</span>
                  <span className="font-mono text-cyan-400">
                    ${new Intl.NumberFormat('en-US').format(value)}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] text-slate-500 flex justify-between items-center pt-2 border-t border-slate-800/80">
        <span>Source: {config.dataSourceKey}</span>
        <span>Target Variance: Normal</span>
      </div>
    </div>
  );
};
