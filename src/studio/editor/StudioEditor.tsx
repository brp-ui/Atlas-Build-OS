import React, { useState } from 'react';
import { DashboardPageSchema, WidgetConfig, WidgetType } from '../schema/types';
import { X, Plus, Trash2, LayoutGrid, Save, MoveUp, MoveDown, Layers, Check } from 'lucide-react';

interface StudioEditorProps {
  schema: DashboardPageSchema;
  onSaveSchema: (updatedSchema: DashboardPageSchema) => void;
  onClose: () => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({ schema, onSaveSchema, onClose }) => {
  const [activeSchema, setActiveSchema] = useState<DashboardPageSchema>(JSON.parse(JSON.stringify(schema)));
  const [viewName, setViewName] = useState(schema.viewName || 'Billy Custom View');

  const handleTitleChange = (newTitle: string) => {
    setActiveSchema((prev) => ({ ...prev, title: newTitle }));
  };

  const handleGridSpanChange = (sectionIdx: number, panelIdx: number, widgetIdx: number, span: 1 | 2 | 3 | 4) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sectionIdx].panels[panelIdx].widgets[widgetIdx].gridSpan = span;
    setActiveSchema(updated);
  };

  const handleRemoveWidget = (sectionIdx: number, panelIdx: number, widgetIdx: number) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    updated.sections[sectionIdx].panels[panelIdx].widgets.splice(widgetIdx, 1);
    setActiveSchema(updated);
  };

  const handleAddWidget = (sectionIdx: number, panelIdx: number) => {
    const updated = JSON.parse(JSON.stringify(activeSchema));
    const newWidget: WidgetConfig = {
      id: `w_custom_${Date.now()}`,
      type: 'kpi',
      title: 'New Metric Widget',
      gridSpan: 1,
      dataSourceKey: 'financial_metrics',
      kpiConfig: {
        metricKey: 'revenue',
        isCurrency: true,
        trend: 'up',
      },
    };
    updated.sections[sectionIdx].panels[panelIdx].widgets.push(newWidget);
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Dashboard Studio Editor</h2>
              <p className="text-xs text-slate-400">Visually adjust panels, grid spans, and custom views without touching code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Dashboard Title</label>
            <input
              type="text"
              value={activeSchema.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Save As Personal View Name</label>
            <input
              type="text"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section & Widget Layout Configurator */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          {activeSchema.sections.map((section, sIdx) => (
            <div key={section.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{section.title}</span>
                <button
                  onClick={() => handleAddWidget(sIdx, 0)}
                  className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs rounded flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Widget
                </button>
              </div>

              {section.panels.map((panel, pIdx) => (
                <div key={panel.id} className="space-y-2">
                  {panel.widgets.map((widget, wIdx) => (
                    <div
                      key={widget.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-4 hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded uppercase">
                          {widget.type}
                        </span>
                        <div>
                          <div className="text-xs font-medium text-slate-200">{widget.title}</div>
                          <div className="text-[11px] text-slate-500">Source: {widget.dataSourceKey}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <span>Columns:</span>
                          {([1, 2, 3, 4] as const).map((span) => (
                            <button
                              key={span}
                              onClick={() => handleGridSpanChange(sIdx, pIdx, wIdx, span)}
                              className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center transition-colors ${
                                widget.gridSpan === span
                                  ? 'bg-cyan-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Check className="w-4 h-4" /> Save View Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
