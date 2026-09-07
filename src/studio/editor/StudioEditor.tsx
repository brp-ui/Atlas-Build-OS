import React, { useState } from 'react';
import { DashboardPageSchema, WidgetConfig, WidgetType } from '../schema/types';
import { KPIWidget } from '../widgets/KPIWidget';
import { TableWidget } from '../widgets/TableWidget';
import { ChartWidget } from '../widgets/ChartWidget';
import { OperationalWidget } from '../widgets/OperationalWidget';
import {
  X,
  Plus,
  Trash2,
  LayoutGrid,
  Save,
  MoveUp,
  MoveDown,
  Palette,
  Eye,
  Check,
  Edit2,
  Sliders,
} from 'lucide-react';

interface StudioEditorProps {
  schema: DashboardPageSchema;
  dataStore: Record<string, any>;
  onSaveSchema: (updatedSchema: DashboardPageSchema) => void;
  onClose: () => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  schema,
  dataStore,
  onSaveSchema,
  onClose,
}) => {
  const [activeSchema, setActiveSchema] = useState<DashboardPageSchema>(JSON.parse(JSON.stringify(schema)));
  const [viewName, setViewName] = useState(schema.viewName || 'Billy Custom View');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const themes: Array<{ id: DashboardPageSchema['theme']; name: string; colorClass: string }> = [
    { id: 'slate', name: 'Slate Dark', colorClass: 'bg-slate-800' },
    { id: 'emerald', name: 'Century Emerald', colorClass: 'bg-emerald-600' },
    { id: 'amber', name: 'Youngman Amber', colorClass: 'bg-amber-500' },
    { id: 'indigo', name: 'Atlas Indigo', colorClass: 'bg-indigo-600' },
  ];

  const handleTitleChange = (newTitle: string) => {
    setActiveSchema((prev) => ({ ...prev, title: newTitle }));
  };

  const handleThemeChange = (theme: DashboardPageSchema['theme']) => {
    setActiveSchema((prev) => ({ ...prev, theme }));
  };

  const handleGridSpanChange = (sIdx: number, pIdx: number, wIdx: number, span: 1 | 2 | 3 | 4) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sIdx].panels[pIdx].widgets[wIdx].gridSpan = span;
    setActiveSchema(updated);
  };

  const handleWidgetTitleChange = (sIdx: number, pIdx: number, wIdx: number, title: string) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sIdx].panels[pIdx].widgets[wIdx].title = title;
    setActiveSchema(updated);
  };

  const handleWidgetTypeChange = (sIdx: number, pIdx: number, wIdx: number, type: WidgetType) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sIdx].panels[pIdx].widgets[wIdx].type = type;
    setActiveSchema(updated);
  };

  const handleMoveWidget = (sIdx: number, pIdx: number, wIdx: number, direction: 'up' | 'down') => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    const widgets = updated.sections[sIdx].panels[pIdx].widgets;
    const targetIdx = direction === 'up' ? wIdx - 1 : wIdx + 1;

    if (targetIdx >= 0 && targetIdx < widgets.length) {
      const temp = widgets[wIdx];
      widgets[wIdx] = widgets[targetIdx];
      widgets[targetIdx] = temp;
      setActiveSchema(updated);
    }
  };

  const handleRemoveWidget = (sIdx: number, pIdx: number, wIdx: number) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sIdx].panels[pIdx].widgets.splice(wIdx, 1);
    setActiveSchema(updated);
  };

  const handleAddWidget = (sIdx: number, pIdx: number) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    const newWidget: WidgetConfig = {
      id: `w_custom_${Date.now()}`,
      type: 'kpi',
      title: 'Custom Metric Widget',
      gridSpan: 1,
      dataSourceKey: 'financial_metrics',
      kpiConfig: {
        metricKey: 'revenue',
        isCurrency: true,
        trend: 'up',
      },
    };
    updated.sections[sIdx].panels[pIdx].widgets.push(newWidget);
    setActiveSchema(updated);
  };

  const handleAddSection = () => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections.push({
      id: `sec_custom_${Date.now()}`,
      title: 'New Custom Section',
      panels: [
        {
          id: `pnl_custom_${Date.now()}`,
          title: 'Custom Panel',
          widgets: [
            {
              id: `w_kpi_${Date.now()}`,
              type: 'kpi',
              title: 'New Metric',
              gridSpan: 2,
              dataSourceKey: 'financial_metrics',
              kpiConfig: { metricKey: 'backlogValue', isCurrency: true, trend: 'up' },
            },
          ],
        },
      ],
    });
    setActiveSchema(updated);
  };

  const handleSave = () => {
    const finalSchema: DashboardPageSchema = {
      ...activeSchema,
      isCustomView: true,
      viewName,
      updatedAt: new Date().toISOString(),
    };
    onSaveSchema(finalSchema);
    onClose();
  };

  const renderWidgetPreview = (widget: WidgetConfig) => {
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
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 space-y-6 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-800/60 rounded-xl text-cyan-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Atlas Visual Dashboard Studio</h2>
              <p className="text-xs text-slate-400">
                Design custom dashboard views, layout grids, metric widgets, and color themes in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'editor' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Structure Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'editor' ? (
          <div className="space-y-6">
            {/* Global Theme & View Metadata Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dashboard Header Title</label>
                <input
                  type="text"
                  value={activeSchema.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Saved Personal View Name</label>
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Color Theme Preset</label>
                <div className="flex items-center gap-2 mt-1">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => handleThemeChange(th.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        activeSchema.theme === th.id
                          ? 'border-cyan-400 text-white bg-slate-800 font-bold'
                          : 'border-slate-800 text-slate-400 bg-slate-900'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${th.colorClass}`} />
                      <span>{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section & Panel Configurator */}
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
              {activeSchema.sections.map((section, sIdx) => (
                <div key={section.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{section.title}</span>
                    <button
                      onClick={() => handleAddWidget(sIdx, 0)}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Widget
                    </button>
                  </div>

                  {section.panels.map((panel, pIdx) => (
                    <div key={panel.id} className="space-y-2.5">
                      {panel.widgets.map((widget, wIdx) => (
                        <div
                          key={widget.id}
                          className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleMoveWidget(sIdx, pIdx, wIdx, 'up')}
                                disabled={wIdx === 0}
                                className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                              >
                                <MoveUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveWidget(sIdx, pIdx, wIdx, 'down')}
                                disabled={wIdx === panel.widgets.length - 1}
                                className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                              >
                                <MoveDown className="w-3 h-3" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={widget.title}
                              onChange={(e) => handleWidgetTitleChange(sIdx, pIdx, wIdx, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded px-2.5 py-1 focus:border-cyan-500 focus:outline-none w-48 font-medium"
                            />

                            <select
                              value={widget.type}
                              onChange={(e) => handleWidgetTypeChange(sIdx, pIdx, wIdx, e.target.value as WidgetType)}
                              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 font-mono"
                            >
                              <option value="kpi">KPI Metric</option>
                              <option value="table">Data Table</option>
                              <option value="chart">Chart Series</option>
                              <option value="operational">Operational Queue</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                              <span>Span:</span>
                              {([1, 2, 3, 4] as const).map((span) => (
                                <button
                                  key={span}
                                  onClick={() => handleGridSpanChange(sIdx, pIdx, wIdx, span)}
                                  className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center transition-all ${
                                    widget.gridSpan === span
                                      ? 'bg-cyan-500 text-slate-950 shadow'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {span}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => handleRemoveWidget(sIdx, pIdx, wIdx)}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

              <button
                onClick={handleAddSection}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-800 text-slate-400 text-xs font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-cyan-400" /> Add New Dashboard Section
              </button>
            </div>
          </div>
        ) : (
          /* Live Preview Mode */
          <div className="max-h-[55vh] overflow-y-auto space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Live Schema Rendering Preview
            </div>

            {activeSchema.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{section.title}</h3>
                {section.panels.map((panel) => (
                  <div key={panel.id} className="grid grid-cols-12 gap-4">
                    {panel.widgets.map((widget) => {
                      let colSpan = 'col-span-12 md:col-span-6 lg:col-span-3';
                      if (widget.gridSpan === 2) colSpan = 'col-span-12 md:col-span-6 lg:col-span-6';
                      if (widget.gridSpan === 3) colSpan = 'col-span-12 lg:col-span-9';
                      if (widget.gridSpan === 4) colSpan = 'col-span-12';

                      return (
                        <div key={widget.id} className={colSpan}>
                          {renderWidgetPreview(widget)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg transition-colors"
          >
            <Check className="w-4 h-4" /> Save View Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
