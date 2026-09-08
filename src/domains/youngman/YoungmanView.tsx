import React, { useState } from 'react';
import { ProjectEntity, OpportunityEntity } from '../../core/data/types';
import { Building2, DollarSign, FileText, Users, HardHat, ShieldCheck, Plus, Layers, ArrowUpRight } from 'lucide-react';

interface YoungmanViewProps {
  projects: ProjectEntity[];
  opportunities: OpportunityEntity[];
  onPromoteOpportunity: (oppId: string) => void;
}

export const YoungmanView: React.FC<YoungmanViewProps> = ({ projects, opportunities, onPromoteOpportunity }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'projects' | 'estimating' | 'field'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Youngman Overview', icon: <Building2 className="w-4 h-4" /> },
          { id: 'crm', label: 'CRM & Pipeline', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'projects', label: 'Project Command Center', icon: <Layers className="w-4 h-4" /> },
          { id: 'estimating', label: 'Estimating & Bidding', icon: <FileText className="w-4 h-4" /> },
          { id: 'field', label: 'Field Operations & Safety', icon: <HardHat className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'crm' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Youngman CRM & Bidding Pipeline</h3>
            <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> New Opportunity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-400 rounded uppercase">
                    {opp.stage}
                  </span>
                  <span className="text-xs font-bold text-slate-300">${new Intl.NumberFormat().format(opp.value)}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{opp.title}</h4>
                <div className="text-[11px] text-slate-400">Trade: {opp.tradeScope}</div>

                {opp.stage !== 'awarded' && (
                  <button
                    onClick={() => onPromoteOpportunity(opp.id)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors mt-2"
                  >
                    <span>Award & Create Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'projects') && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Youngman Active Projects Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((prj) => (
              <div key={prj.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-amber-400 rounded">
                      {prj.code}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${
                        prj.health === 'healthy'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {prj.health}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 uppercase font-mono">{prj.stage}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{prj.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Manager: {prj.projectManager}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Contract</div>
                    <div className="font-semibold text-slate-200">${new Intl.NumberFormat().format(prj.contractValue)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Actual Cost</div>
                    <div className="font-semibold text-slate-200">${new Intl.NumberFormat().format(prj.actualCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">GM %</div>
                    <div
                      className={`font-semibold ${
                        prj.grossMarginPercent < 25 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {prj.grossMarginPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'estimating' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-200">Estimating & Scope Verification Engine</h4>
          <p>Scope & Takeoff modules configured with direct/indirect cost limits, overhead, and margin checks.</p>
        </div>
      )}

      {activeTab === 'field' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-200">Field Operations & Daily Logs</h4>
          <p>Mobile-first layout for daily logs, workforce counts, weather tracking, equipment, and punch lists.</p>
        </div>
      )}
    </div>
  );
};
