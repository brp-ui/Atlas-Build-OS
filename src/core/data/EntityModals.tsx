import React, { useState } from 'react';
import { ProjectEntity, RFISchema, ChangeOrderEntity, PermitEntity } from './types';
import { X, Plus, Check, FileText, AlertCircle, ShieldCheck, FolderPlus } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  activeWorkspaceId: string;
  onClose: () => void;
  onCreateProject: (project: ProjectEntity) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  activeWorkspaceId,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [contractValue, setContractValue] = useState(350000);
  const [budget, setBudget] = useState(260000);
  const [pm, setPm] = useState('Billy Palumbo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gp = contractValue - budget;
    const gpPct = contractValue > 0 ? (gp / contractValue) * 100 : 0;

    const newPrj: ProjectEntity = {
      id: `prj_${Date.now()}`,
      workspaceId: activeWorkspaceId,
      type: 'project',
      code: `${activeWorkspaceId === 'ws_century' ? 'CF' : 'YM'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      status: 'active',
      stage: 'preconstruction',
      customerId: 'cust_new',
      contractValue,
      originalBudget: budget,
      committedCost: 0,
      actualCost: 0,
      projectedGP: gp,
      grossMarginPercent: Number(gpPct.toFixed(2)),
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      projectManager: pm,
      health: gpPct < 22 ? 'at_risk' : 'healthy',
      ownerId: 'usr_billy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateProject(newPrj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Create New Project Record</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Name / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Commercial Plaza Roofing Overhaul"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contract Value ($)</label>
              <input
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Original Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assigned Project Manager</label>
            <input
              type="text"
              value={pm}
              onChange={(e) => setPm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1 shadow"
            >
              <Check className="w-4 h-4" /> Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateRFIModalProps {
  isOpen: boolean;
  activeWorkspaceId: string;
  projects: ProjectEntity[];
  onClose: () => void;
  onCreateRFI: (rfi: RFISchema) => void;
}

export const CreateRFIModal: React.FC<CreateRFIModalProps> = ({
  isOpen,
  activeWorkspaceId,
  projects,
  onClose,
  onCreateRFI,
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newRFI: RFISchema = {
      id: `rfi_${Date.now()}`,
      workspaceId: activeWorkspaceId,
      type: 'rfi',
      rfiNumber: Math.floor(10 + Math.random() * 90),
      projectId,
      title: title || 'Clarification Request',
      status: 'open',
      question,
      assignedTo: 'Engineering Review Team',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      ballInCourt: 'Architect / Engineer',
      impactsSchedule: false,
      impactsCost: false,
      ownerId: 'usr_billy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateRFI(newRFI);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Issue Engineering RFI</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">RFI Subject / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Parapet Flashing Specs"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Question / Clarification Details</label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe drawing discrepancy or clarification needed..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center gap-1 shadow"
            >
              <Check className="w-4 h-4" /> Issue RFI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
