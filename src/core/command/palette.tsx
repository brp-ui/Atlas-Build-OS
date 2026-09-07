import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight, X, Building2, Flame, User, Sparkles, Plus, FolderKanban, FileCode } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkspace: (wsId: string) => void;
  onOpenAIBuilder: () => void;
  onNavigateDomain: (domain: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectWorkspace,
  onOpenAIBuilder,
  onNavigateDomain,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'cmd_switch_ym',
      category: 'Workspace',
      title: 'Switch to Youngman Services Workspace',
      icon: <Building2 className="w-4 h-4 text-amber-400" />,
      action: () => {
        onSelectWorkspace('ws_youngman');
        onClose();
      },
    },
    {
      id: 'cmd_switch_cf',
      category: 'Workspace',
      title: 'Switch to Century Fire Workspace',
      icon: <Flame className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onSelectWorkspace('ws_century');
        onClose();
      },
    },
    {
      id: 'cmd_switch_pers',
      category: 'Workspace',
      title: 'Switch to Personal OS Workspace',
      icon: <User className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onSelectWorkspace('ws_personal');
        onClose();
      },
    },
    {
      id: 'cmd_ai_gen',
      category: 'AI Builder',
      title: 'Generate Custom Dashboard with AI Prompt',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      action: () => {
        onOpenAIBuilder();
        onClose();
      },
    },
    {
      id: 'cmd_nav_projects',
      category: 'Domain',
      title: 'Open Project Management Command Center',
      icon: <FolderKanban className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigateDomain('project_management');
        onClose();
      },
    },
    {
      id: 'cmd_nav_estimating',
      category: 'Domain',
      title: 'Open Estimating & Takeoff Suite',
      icon: <FileCode className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigateDomain('estimating');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search entities... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No matching commands found</div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-left group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-slate-700">
                    {cmd.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{cmd.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{cmd.category}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Atlas Global Palette</span>
          <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
