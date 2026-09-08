import React, { useState } from 'react';
import { ProjectEntity, PermitEntity, RFISchema } from '../../core/data/types';
import { Flame, ShieldCheck, FileCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CenturyViewProps {
  projects: ProjectEntity[];
  permits: PermitEntity[];
  rfis: RFISchema[];
}

export const CenturyView: React.FC<CenturyViewProps> = ({ projects, permits, rfis }) => {
  const [activeSubTab, setActiveSubTab] = useState<'permits' | 'projects' | 'inspections'>('permits');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950 border border-emerald-800/60 rounded-xl text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Century Fire Domain Pack</h3>
            <p className="text-xs text-slate-400">Fire protection, sprinkler systems, AHJ permitting & inspection tracking</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded uppercase">
          Strict Data Boundary
        </span>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('permits')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeSubTab === 'permits' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
          }`}
        >
          AHJ Permits & Reviews
        </button>
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeSubTab === 'projects' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
          }`}
        >
          Fire Protection Projects
        </button>
      </div>

      {activeSubTab === 'permits' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active AHJ Permit Tracker</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permits.map((pmt) => (
              <div key={pmt.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">{pmt.permitNumber}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded uppercase">
                    {pmt.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white">{pmt.title}</h5>
                <div className="text-[11px] text-slate-400">AHJ: {pmt.ahjName}</div>
                <div className="text-[11px] text-slate-500">Expires: {pmt.expirationDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Century Fire Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((prj) => (
              <div key={prj.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{prj.code}</span>
                  <span className="text-xs text-emerald-400 font-bold">{prj.grossMarginPercent.toFixed(1)}% GM</span>
                </div>
                <h5 className="text-xs font-bold text-white">{prj.title}</h5>
                <div className="text-[11px] text-slate-400">Contract: ${new Intl.NumberFormat().format(prj.contractValue)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
