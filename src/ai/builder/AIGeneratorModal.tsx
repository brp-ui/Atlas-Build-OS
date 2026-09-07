import React, { useState } from 'react';
import { AIDashboardGenerator } from './generator';
import { DashboardPageSchema } from '../../studio/schema/types';
import { Sparkles, X, Check, ArrowRight, Layout, RefreshCw } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  activeWorkspaceId: string;
  onClose: () => void;
  onApplyGeneratedSchema: (schema: DashboardPageSchema) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  activeWorkspaceId,
  onClose,
  onApplyGeneratedSchema,
}) => {
  const [prompt, setPrompt] = useState(
    'Create a project executive dashboard for Youngman Services showing projects over $100K with less than 30% gross margin'
  );
  const [generatedSchema, setGeneratedSchema] = useState<DashboardPageSchema | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const generator = new AIDashboardGenerator();
    const schema = generator.generateDashboardFromPrompt(prompt, activeWorkspaceId);
    setGeneratedSchema(schema);
  };

  const handleApply = () => {
    if (generatedSchema) {
      onApplyGeneratedSchema(generatedSchema);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-900/50 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950 border border-purple-800/60 rounded-xl text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Atlas AI Dashboard Builder</h3>
              <p className="text-xs text-slate-400">Transform natural language requirements into structured dashboard layouts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Natural Language Dashboard Spec</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-purple-500 focus:outline-none placeholder-slate-600"
            placeholder="Describe the dashboard, filters, metrics, and widgets you want Atlas to build..."
          />

          <button
            onClick={handleGenerate}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Generate Dashboard Definition Schema
          </button>
        </div>

        {/* Preview generated schema */}
        {generatedSchema && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Generated Schema Preview</span>
              <span className="text-[10px] font-mono text-slate-400">{generatedSchema.id}</span>
            </div>

            <div className="text-xs font-bold text-white">{generatedSchema.title}</div>
            <div className="text-xs text-slate-400">{generatedSchema.description}</div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-500">Generated Widgets</div>
              <ul className="text-xs text-slate-300 space-y-1">
                {generatedSchema.sections[0].panels[0].widgets.map((w) => (
                  <li key={w.id} className="flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-purple-400" />
                    <span>
                      <strong>{w.title}</strong> ({w.type} widget, span {w.gridSpan})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
            Cancel
          </button>
          {generatedSchema && (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Check className="w-4 h-4" /> Apply AI Dashboard to Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
