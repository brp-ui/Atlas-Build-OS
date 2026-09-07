import React from 'react';
import { DashboardPageSchema, WidgetConfig } from '../schema/types';
import { KPIWidget } from '../widgets/KPIWidget';
import { TableWidget } from '../widgets/TableWidget';
import { ChartWidget } from '../widgets/ChartWidget';
import { OperationalWidget } from '../widgets/OperationalWidget';
import { Edit3, SlidersHorizontal, Sparkles } from 'lucide-react';

interface DashboardRendererProps {
  schema: DashboardPageSchema;
  dataStore: Record<string, any>;
  onOpenStudio?: () => void;
  onOpenAIBuilder?: () => void;
}

export const DashboardRenderer: React.FC<DashboardRendererProps> = ({
  schema,
  dataStore,
  onOpenStudio,
  onOpenAIBuilder,
}) => {
  const renderWidget = (widget: WidgetConfig) => {
    const data = dataStore[widget.dataSourceKey];

    switch (widget.type) {
      case 'kpi':
        return <KPIWidget config={widget} data={data} />;
      case 'table':
        return <TableWidget config={widget} data={Array.isArray(data) ? data : []} />;
      case 'chart':
        return <ChartWidget config={widget} data={Array.isArray(data) ? data : []} />;
      case 'operational':
        return <OperationalWidget config={widget} data={Array.isArray(data) ? data : []} />;
      default:
        return (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
            {widget.title} ({widget.type})
          </div>
        );
    }
  };

  const getGridSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return 'col-span-12 md:col-span-6 lg:col-span-3';
      case 2:
        return 'col-span-12 md:col-span-6 lg:col-span-6';
      case 3:
        return 'col-span-12 lg:col-span-9';
      case 4:
      default:
        return 'col-span-12';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">{schema.title}</h1>
            {schema.isCustomView && (
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded text-xs font-medium">
                Saved View: {schema.viewName || 'Custom'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{schema.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIBuilder && (
            <button
              onClick={onOpenAIBuilder}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Dashboard Generator
            </button>
          )}

          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              Customize in Studio
            </button>
          )}
        </div>
      </div>

      {/* Render Sections */}
      {schema.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{section.title}</h3>
          </div>

          {section.panels.map((panel) => (
            <div key={panel.id} className="space-y-3">
              <div className="grid grid-cols-12 gap-4">
                {panel.widgets.map((widget) => (
                  <div key={widget.id} className={getGridSpanClass(widget.gridSpan)}>
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
