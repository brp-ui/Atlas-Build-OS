import React from 'react';
import { ProjectEntity, RFISchema, ChangeOrderEntity, PermitEntity, BaseEntity } from './types';
import { RelationshipEngine } from '../relationships/engine';
import { X, Building2, Layers, Calendar, DollarSign, ArrowRight, ShieldCheck, FileText, Activity, Sparkles, Check } from 'lucide-react';

interface EntityDetailDrawerProps {
  entity: any | null;
  relationshipEngine: RelationshipEngine;
  onClose: () => void;
  onUpdateEntity?: (updatedEntity: any) => void;
}

export const EntityDetailDrawer: React.FC<EntityDetailDrawerProps> = ({
  entity,
  relationshipEngine,
  onClose,
  onUpdateEntity,
}) => {
  if (!entity) return null;

  const isProject = entity.type === 'project';
  const isRFI = entity.type === 'rfi';
  const isCO = entity.type === 'change_order';
  const isPermit = entity.type === 'permit';

  const relatedSummary = isProject ? relationshipEngine.getProjectRelatedSummary(entity.id) : null;

  const handleStageAdvance = () => {
    if (!isProject || !onUpdateEntity) return;
    const stages = ['preconstruction', 'procurement', 'mobilization', 'construction', 'punch', 'closeout', 'warranty'];
    const currentIdx = stages.indexOf(entity.stage);
    if (currentIdx >= 0 && currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      onUpdateEntity({ ...entity, stage: nextStage, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-cyan-300 rounded uppercase">
                  {entity.type}
                </span>
                {entity.code && <span className="text-xs font-mono text-slate-400">{entity.code}</span>}
              </div>
              <h3 className="text-sm font-bold text-white mt-1">{entity.title || entity.question || entity.reason}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Status & Lifecycle Controls */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Current Status / Stage</span>
              <span className="px-2.5 py-1 bg-slate-800 text-cyan-300 rounded-full font-mono uppercase text-[10px] border border-slate-700 font-bold">
                {entity.stage || entity.status || 'Active'}
              </span>
            </div>

            {isProject && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Lifecycle Stage Advancement:</span>
                <button
                  onClick={handleStageAdvance}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Financials Breakdown if Project */}
          {isProject && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Financial Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Contract Value</span>
                  <div className="text-base font-bold text-slate-100">
                    ${new Intl.NumberFormat().format(entity.contractValue)}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Projected Gross Margin</span>
                  <div className={`text-base font-bold ${entity.grossMarginPercent < 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {entity.grossMarginPercent?.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connected Entity Relationships */}
          {relatedSummary && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Connected Entity Graph</h4>
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <div>
                  <div className="text-lg font-bold text-cyan-400">{relatedSummary.rfiCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Linked RFIs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-400">{relatedSummary.changeOrderCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Change Orders</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-400">{relatedSummary.permitCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">AHJ Permits</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Intelligence Context */}
          {entity.aiContext && (
            <div className="p-4 bg-purple-950/20 border border-purple-900/50 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Atlas AI Context Insight</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{entity.aiContext}</p>
            </div>
          )}

          {/* Activity History */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Log & History</h4>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Record Created</span>
                <span>{new Date(entity.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Updated</span>
                <span>{new Date(entity.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Owner</span>
                <span className="text-slate-200">{entity.projectManager || entity.ownerId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">ID: {entity.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
