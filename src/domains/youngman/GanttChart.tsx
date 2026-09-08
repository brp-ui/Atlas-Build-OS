import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

export interface GanttTask {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  criticalPath: boolean;
  dependencies: string[];
  assignee: string;
  stage: 'Preconstruction' | 'Procurement' | 'Mobilization' | 'Construction' | 'Closeout';
}

interface GanttChartProps {
  projectName: string;
  initialTasks?: GanttTask[];
  onTaskProgressChange?: (taskId: string, newProgress: number) => void;
}

const DEFAULT_TASKS: GanttTask[] = [
  {
    id: 'G1',
    title: 'AHJ Permit Approval & Civil Plans',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    progress: 100,
    criticalPath: true,
    dependencies: [],
    assignee: 'Sarah Connor (Permit Specialist)',
    stage: 'Preconstruction',
  },
  {
    id: 'G2',
    title: 'Structural Steel Buyout & Fabrication',
    startDate: '2026-03-10',
    endDate: '2026-04-05',
    progress: 65,
    criticalPath: true,
    dependencies: ['G1'],
    assignee: 'Dave Miller (Procurement)',
    stage: 'Procurement',
  },
  {
    id: 'G3',
    title: 'Site Logistics & Foundation Prep',
    startDate: '2026-03-16',
    endDate: '2026-03-30',
    progress: 40,
    criticalPath: false,
    dependencies: ['G1'],
    assignee: 'Mike Smith (Superintendent)',
    stage: 'Mobilization',
  },
  {
    id: 'G4',
    title: 'Erection of Structural Frame & Joists',
    startDate: '2026-04-06',
    endDate: '2026-05-10',
    progress: 10,
    criticalPath: true,
    dependencies: ['G2', 'G3'],
    assignee: 'Ironworkers Subcontractor',
    stage: 'Construction',
  },
  {
    id: 'G5',
    title: 'Rough MEP & Overhead Piping',
    startDate: '2026-05-01',
    endDate: '2026-06-01',
    progress: 0,
    criticalPath: false,
    dependencies: ['G4'],
    assignee: 'Apex Mechanical',
    stage: 'Construction',
  },
  {
    id: 'G6',
    title: 'Final AHJ Inspection & Punch List',
    startDate: '2026-06-02',
    endDate: '2026-06-15',
    progress: 0,
    criticalPath: true,
    dependencies: ['G5'],
    assignee: 'Mike Smith / Owner Representative',
    stage: 'Closeout',
  },
];

export const GanttChart: React.FC<GanttChartProps> = ({
  projectName,
  initialTasks = DEFAULT_TASKS,
  onTaskProgressChange,
}) => {
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);
  const [filterStage, setFilterStage] = useState<string>('All');

  const handleProgressSlider = (id: string, newProg: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, progress: newProg } : t));
    setTasks(updated);
    if (onTaskProgressChange) {
      onTaskProgressChange(id, newProg);
    }
  };

  const filteredTasks = filterStage === 'All'
    ? tasks
    : tasks.filter((t) => t.stage === filterStage);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Interactive Construction Gantt Timeline</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Project: <span className="text-indigo-300 font-semibold">{projectName}</span> — Critical Path Tracking & Stage Gates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Stage Filter:</label>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Stages</option>
            <option value="Preconstruction">Preconstruction</option>
            <option value="Procurement">Procurement</option>
            <option value="Mobilization">Mobilization</option>
            <option value="Construction">Construction</option>
            <option value="Closeout">Closeout</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 px-3">Task Name & Assignee</th>
              <th className="py-2 px-3">Dates</th>
              <th className="py-2 px-3">Critical Path</th>
              <th className="py-2 px-3 min-w-[200px]">Schedule Timeline & Progress Slider</th>
              <th className="py-2 px-3 text-right">% Complete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    {t.title}
                  </div>
                  <div className="text-[10px] text-slate-500 pl-5">
                    Assignee: {t.assignee} | Stage: <span className="text-slate-400">{t.stage}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{t.startDate} → {t.endDate}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  {t.criticalPath ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" /> Critical Path
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Standard</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="space-y-1">
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full transition-all duration-300 ${
                          t.criticalPath
                            ? t.progress === 100
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={t.progress}
                      onChange={(e) => handleProgressSlider(t.id, Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-1"
                    />
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                  {t.progress === 100 ? (
                    <span className="text-emerald-400 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100%
                    </span>
                  ) : (
                    `${t.progress}%`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
