import React from 'react';
import { DashboardRenderer } from '../../studio/renderer/DashboardRenderer';
import { YOUNGMAN_EXECUTIVE_DASHBOARD, CENTURY_FIRE_DASHBOARD, PERSONAL_OS_DASHBOARD } from '../../studio/schema/templates';
import { AIAgentSystem } from '../../ai/agents/agentSystem';
import { Sparkles, Check, X, AlertTriangle, ShieldCheck, TrendingUp, Clock, Calendar } from 'lucide-react';

interface CommandCenterViewProps {
  activeWorkspaceId: string;
  dataStore: Record<string, any>;
  agentSystem: AIAgentSystem;
  onOpenStudio: () => void;
  onOpenAIBuilder: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  activeWorkspaceId,
  dataStore,
  agentSystem,
  onOpenStudio,
  onOpenAIBuilder,
}) => {
  const [recs, setRecs] = React.useState(agentSystem.getRecommendations());

  const handleApprove = (id: string) => {
    agentSystem.approveRecommendation(id);
    setRecs(agentSystem.getRecommendations());
  };

  const handleReject = (id: string) => {
    agentSystem.rejectRecommendation(id);
    setRecs(agentSystem.getRecommendations());
  };

  let activeSchema = YOUNGMAN_EXECUTIVE_DASHBOARD;
  if (activeWorkspaceId === 'ws_century') activeSchema = CENTURY_FIRE_DASHBOARD;
  if (activeWorkspaceId === 'ws_personal') activeSchema = PERSONAL_OS_DASHBOARD;

  return (
    <div className="space-y-8">
      {/* AI CEO Intelligence & Morning Brief Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-950/80 border border-purple-800/60 rounded-xl text-purple-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Atlas AI CEO Executive Intelligence</h2>
              <p className="text-xs text-slate-400">Continuous monitoring across business rules, financial margins, and risk limits</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 font-mono">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Morning Brief: March 3, 2026</span>
          </div>
        </div>

        {/* AI Executive Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {recs.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-slate-950/90 border border-slate-800/90 rounded-xl space-y-3 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/50 rounded">
                    {rec.agentType} Agent
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                      rec.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300'
                        : rec.status === 'rejected'
                        ? 'bg-rose-950 text-rose-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mt-1">{rec.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rec.insight}</p>
                <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-900/40 mt-2 font-medium">
                  Recommendation: {rec.recommendedAction}
                </div>
              </div>

              {rec.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleApprove(rec.id)}
                    className="flex-1 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Action
                  </button>
                  <button
                    onClick={() => handleReject(rec.id)}
                    className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render Dynamic Dashboard Layout */}
      <DashboardRenderer
        schema={activeSchema}
        dataStore={dataStore}
        onOpenStudio={onOpenStudio}
        onOpenAIBuilder={onOpenAIBuilder}
      />
    </div>
  );
};
