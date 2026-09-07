import React from 'react';
import { PersonalGoalEntity, FinancialSummaryEntity } from '../../core/data/types';
import { User, DollarSign, Target, Calendar, CheckSquare, ShieldCheck, Heart } from 'lucide-react';

interface PersonalViewProps {
  goals: PersonalGoalEntity[];
  financials?: FinancialSummaryEntity;
}

export const PersonalView: React.FC<PersonalViewProps> = ({ goals, financials }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-950 border border-indigo-800/60 rounded-xl text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Atlas Personal OS & Morning Brief</h3>
            <p className="text-xs text-slate-400">Personal finances, liquid cash reserve, investment goals, and daily focus</p>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      {financials && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Monthly Income</div>
            <div className="text-xl font-bold text-white">${new Intl.NumberFormat().format(financials.revenue)}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Monthly Obligations / Bills</div>
            <div className="text-xl font-bold text-amber-400">${new Intl.NumberFormat().format(financials.apExposure)}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Liquid Cash Reserve</div>
            <div className="text-xl font-bold text-emerald-400">${new Intl.NumberFormat().format(financials.cashOnHand)}</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Net Worth / Assets</div>
            <div className="text-xl font-bold text-cyan-400">${new Intl.NumberFormat().format(financials.backlogValue)}</div>
          </div>
        </div>
      )}

      {/* Strategic Goals */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Strategic Goals & Milestones</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            return (
              <div key={goal.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded uppercase">
                    {goal.category}
                  </span>
                  <span className="text-xs font-bold text-indigo-400">{pct}% Complete</span>
                </div>
                <h5 className="text-xs font-bold text-white">{goal.title}</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Progress:</span>
                    <span>
                      {goal.unit}
                      {new Intl.NumberFormat().format(goal.currentValue)} / {goal.unit}
                      {new Intl.NumberFormat().format(goal.targetValue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
