import React, { useState } from 'react';
import { ProjectEntity, OpportunityEntity } from '../../core/data/types';
import { Building2, DollarSign, FileText, Users, HardHat, ShieldCheck, Plus, Layers, ArrowUpRight, Calculator, Check } from 'lucide-react';

interface YoungmanViewProps {
  projects: ProjectEntity[];
  opportunities: OpportunityEntity[];
  onPromoteOpportunity: (oppId: string) => void;
}

export const YoungmanView: React.FC<YoungmanViewProps> = ({ projects, opportunities, onPromoteOpportunity }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'projects' | 'estimating' | 'field'>('overview');

  // Estimating Interactive Calculator State
  const [directCost, setDirectCost] = useState(180000);
  const [overheadPct, setOverheadPct] = useState(10);
  const [targetMarginPct, setTargetMarginPct] = useState(25);

  const overheadVal = Math.round(directCost * (overheadPct / 100));
  const subtotalCost = directCost + overheadVal;
  const sellingPrice = Math.round(subtotalCost / (1 - targetMarginPct / 100));
  const profitVal = sellingPrice - subtotalCost;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Youngman Overview', icon: <Building2 className="w-4 h-4" /> },
          { id: 'crm', label: 'CRM & Pipeline', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'projects', label: 'Project Command Center', icon: <Layers className="w-4 h-4" /> },
          { id: 'estimating', label: 'Estimating & Bidding Calculator', icon: <Calculator className="w-4 h-4" /> },
          { id: 'field', label: 'Field Operations & Safety', icon: <HardHat className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Estimating Scope Calculator Tab */}
      {activeTab === 'estimating' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-amber-950 border border-amber-800/60 rounded-xl text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Youngman Estimating & Profit Margin Calculator</h3>
              <p className="text-xs text-slate-400">Calculate selling price, overhead allocation, and target gross margin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Direct Cost ($)</label>
                <input
                  type="number"
                  value={directCost}
                  onChange={(e) => setDirectCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-2.5 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Overhead Rate (%)</label>
                <input
                  type="number"
                  value={overheadPct}
                  onChange={(e) => setOverheadPct(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-2.5 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Gross Margin (%)</label>
                <input
                  type="number"
                  value={targetMarginPct}
                  onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-2.5 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Overhead Allocation</div>
                <div className="text-xl font-bold text-slate-200">${new Intl.NumberFormat().format(overheadVal)}</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Total Estimated Cost</div>
                <div className="text-xl font-bold text-slate-200">${new Intl.NumberFormat().format(subtotalCost)}</div>
              </div>

              <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1">
                <div className="text-[10px] text-amber-400 uppercase font-mono">Calculated Selling Price</div>
                <div className="text-2xl font-black text-amber-400">${new Intl.NumberFormat().format(sellingPrice)}</div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1">
                <div className="text-[10px] text-emerald-400 uppercase font-mono">Projected Net Profit</div>
                <div className="text-2xl font-black text-emerald-400">${new Intl.NumberFormat().format(profitVal)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRM & Pipeline */}
      {activeTab === 'crm' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Youngman CRM & Bidding Pipeline</h3>
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

      {activeTab === 'field' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-200">Field Operations & Daily Logs</h4>
          <p>Mobile-first layout for daily logs, workforce counts, weather tracking, equipment, and punch lists.</p>
        </div>
      )}
    </div>
  );
};
