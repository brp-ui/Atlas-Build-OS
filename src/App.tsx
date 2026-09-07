import React, { useState } from 'react';
import { IdentityManager } from './core/identity/store';
import { RelationshipEngine } from './core/relationships/engine';
import { LifecycleEngine } from './core/lifecycle/engine';
import { NotificationQueue } from './core/notifications/queue';
import { AutomationEngine } from './core/automation/engine';
import { AIAgentSystem } from './ai/agents/agentSystem';
import {
  SAMPLE_PROJECTS,
  SAMPLE_OPPORTUNITIES,
  SAMPLE_RFIS,
  SAMPLE_CHANGE_ORDERS,
  SAMPLE_PERMITS,
  SAMPLE_FINANCIAL_METRICS,
  SAMPLE_GOALS,
} from './core/data/sampleData';
import { CommandCenterView } from './domains/commandCenter/CommandCenterView';
import { YoungmanView } from './domains/youngman/YoungmanView';
import { CenturyView } from './domains/century/CenturyView';
import { PersonalView } from './domains/personal/PersonalView';
import { StudioEditor } from './studio/editor/StudioEditor';
import { AIGeneratorModal } from './ai/builder/AIGeneratorModal';
import { CommandPalette } from './core/command/palette';
import { NotificationDrawer } from './core/notifications/NotificationDrawer';
import { CreateProjectModal, CreateRFIModal } from './core/data/EntityModals';
import { DashboardPageSchema } from './studio/schema/types';
import { YOUNGMAN_EXECUTIVE_DASHBOARD, CENTURY_FIRE_DASHBOARD, PERSONAL_OS_DASHBOARD } from './studio/schema/templates';

import {
  Building2,
  Flame,
  User,
  Sparkles,
  Command,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Shield,
  Layers,
  LayoutGrid,
  Search,
  Plus,
} from 'lucide-react';

export function App() {
  // Core Platform Engines Initializer
  const [identityManager] = useState(() => new IdentityManager());
  const [relationshipEngine] = useState(() => new RelationshipEngine());
  const [lifecycleEngine] = useState(() => new LifecycleEngine(relationshipEngine));
  const [notificationQueue] = useState(() => new NotificationQueue());
  const [automationEngine] = useState(() => new AutomationEngine(notificationQueue));
  const [agentSystem] = useState(() => new AIAgentSystem());

  // Reactive State
  const [activeWorkspace, setActiveWorkspace] = useState(identityManager.getActiveWorkspace());
  const [activeRole, setActiveRole] = useState(identityManager.getActiveRole());
  const [activeDomain, setActiveDomain] = useState<string>('command_center');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Entities Data Store
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [opportunities, setOpportunities] = useState(SAMPLE_OPPORTUNITIES);
  const [rfis, setRfis] = useState(SAMPLE_RFIS);
  const [changeOrders] = useState(SAMPLE_CHANGE_ORDERS);
  const [permits] = useState(SAMPLE_PERMITS);
  const [goals] = useState(SAMPLE_GOALS);
  const [financialMetrics] = useState(SAMPLE_FINANCIAL_METRICS);

  // Modals & Drawers
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateRFIOpen, setIsCreateRFIOpen] = useState(false);

  // Custom schemas per workspace
  const [activeSchema, setActiveSchema] = useState<DashboardPageSchema>(() => YOUNGMAN_EXECUTIVE_DASHBOARD);

  // Workspace Switch Handler (Enforcing Strict Data Boundary)
  const handleSwitchWorkspace = (workspaceId: string) => {
    const ws = identityManager.switchWorkspace(workspaceId);
    setActiveWorkspace(ws);

    if (ws.id === 'ws_century') {
      setActiveSchema(CENTURY_FIRE_DASHBOARD);
    } else if (ws.id === 'ws_personal') {
      setActiveSchema(PERSONAL_OS_DASHBOARD);
    } else {
      setActiveSchema(YOUNGMAN_EXECUTIVE_DASHBOARD);
    }
  };

  // Role Switch Handler
  const handleSwitchRole = (roleId: any) => {
    const r = identityManager.switchRole(roleId);
    setActiveRole(r);
  };

  // Opportunity Award Lifecycle Trigger
  const handlePromoteOpportunity = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    const { updatedOpportunity, createdProject } = lifecycleEngine.promoteOpportunity(opp, 'awarded');

    setOpportunities((prev) => prev.map((o) => (o.id === oppId ? updatedOpportunity : o)));

    if (createdProject) {
      setProjects((prev) => [createdProject, ...prev]);

      // Trigger automation evaluation
      automationEngine.evaluateEvent('opportunity_submitted', updatedOpportunity);
      setRefreshTrigger((r) => r + 1);
    }
  };

  // Strict Filter Data Store per active Workspace
  const filteredProjects = projects.filter((p) => identityManager.isEntityInActiveWorkspace(p.workspaceId));
  const filteredOpportunities = opportunities.filter((o) => identityManager.isEntityInActiveWorkspace(o.workspaceId));
  const filteredRFIs = rfis.filter((r) => identityManager.isEntityInActiveWorkspace(r.workspaceId));
  const filteredChangeOrders = changeOrders.filter((c) => identityManager.isEntityInActiveWorkspace(c.workspaceId));
  const filteredPermits = permits.filter((p) => identityManager.isEntityInActiveWorkspace(p.workspaceId));
  const filteredGoals = goals.filter((g) => identityManager.isEntityInActiveWorkspace(g.workspaceId));
  const workspaceFinancials = financialMetrics[activeWorkspace.id];

  const dataStore = {
    projects: filteredProjects,
    opportunities: filteredOpportunities,
    rfis: filteredRFIs,
    change_orders: filteredChangeOrders,
    permits: filteredPermits,
    goals: filteredGoals,
    financial_metrics: workspaceFinancials,
  };

  const notifications = notificationQueue.getNotificationsForWorkspace(activeWorkspace.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl text-slate-950 font-black shadow-md">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white">ATLAS OS</div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Adaptive Operations</div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {identityManager.getWorkspaces().map((ws) => {
              const isActive = ws.id === activeWorkspace.id;
              let icon = <Building2 className="w-3.5 h-3.5" />;
              if (ws.id === 'ws_century') icon = <Flame className="w-3.5 h-3.5 text-emerald-400" />;
              if (ws.id === 'ws_personal') icon = <User className="w-3.5 h-3.5 text-indigo-400" />;

              return (
                <button
                  key={ws.id}
                  onClick={() => handleSwitchWorkspace(ws.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {icon}
                  <span>{ws.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Header Bar Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Create Project */}
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>

          {/* Search & Command Palette */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Commands...</span>
            <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-500 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* AI Builder Button */}
          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Builder</span>
          </button>

          {/* Notifications Queue Counter */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <Shield className="w-4 h-4 text-cyan-400" />
            <select
              value={activeRole.id}
              onChange={(e) => handleSwitchRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {identityManager.getRoles().map((r) => (
                <option key={r.id} value={r.id}>
                  Role: {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Domain Nav */}
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-4 space-y-6 shrink-0 hidden md:block">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Workspace Domains
            </div>
            <nav className="space-y-1">
              {[
                { id: 'command_center', label: 'Command Center & AI CEO', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
                { id: 'youngman', label: 'Youngman Services', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
                { id: 'century', label: 'Century Fire', icon: <Flame className="w-4 h-4 text-emerald-400" /> },
                { id: 'personal', label: 'Personal OS & Finance', icon: <User className="w-4 h-4 text-indigo-400" /> },
              ].map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeDomain === domain.id
                      ? 'bg-slate-800 text-white border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {domain.icon}
                  <span>{domain.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Platform Studio
            </div>
            <button
              onClick={() => setIsStudioOpen(true)}
              className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span>Dashboard Studio</span>
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </aside>

        {/* Active Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
          {activeDomain === 'command_center' && (
            <CommandCenterView
              activeWorkspaceId={activeWorkspace.id}
              dataStore={dataStore}
              agentSystem={agentSystem}
              onOpenStudio={() => setIsStudioOpen(true)}
              onOpenAIBuilder={() => setIsAIGeneratorOpen(true)}
            />
          )}

          {activeDomain === 'youngman' && (
            <YoungmanView
              projects={filteredProjects}
              opportunities={filteredOpportunities}
              onPromoteOpportunity={handlePromoteOpportunity}
            />
          )}

          {activeDomain === 'century' && (
            <CenturyView
              projects={filteredProjects}
              permits={filteredPermits}
              rfis={filteredRFIs}
            />
          )}

          {activeDomain === 'personal' && (
            <PersonalView goals={filteredGoals} financials={workspaceFinancials} />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      {isStudioOpen && (
        <StudioEditor
          schema={activeSchema}
          dataStore={dataStore}
          onSaveSchema={(updated) => setActiveSchema(updated)}
          onClose={() => setIsStudioOpen(false)}
        />
      )}

      {isAIGeneratorOpen && (
        <AIGeneratorModal
          isOpen={isAIGeneratorOpen}
          activeWorkspaceId={activeWorkspace.id}
          onClose={() => setIsAIGeneratorOpen(false)}
          onApplyGeneratedSchema={(generated) => {
            setActiveSchema(generated);
            setActiveDomain('command_center');
          }}
        />
      )}

      {isCreateProjectOpen && (
        <CreateProjectModal
          isOpen={isCreateProjectOpen}
          activeWorkspaceId={activeWorkspace.id}
          onClose={() => setIsCreateProjectOpen(false)}
          onCreateProject={(newPrj) => setProjects((prev) => [newPrj, ...prev])}
        />
      )}

      {isCreateRFIOpen && (
        <CreateRFIModal
          isOpen={isCreateRFIOpen}
          activeWorkspaceId={activeWorkspace.id}
          projects={filteredProjects}
          onClose={() => setIsCreateRFIOpen(false)}
          onCreateRFI={(newRFI) => setRfis((prev) => [newRFI, ...prev])}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        workspaceId={activeWorkspace.id}
        queue={notificationQueue}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onRefresh={() => setRefreshTrigger((r) => r + 1)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectWorkspace={handleSwitchWorkspace}
        onOpenAIBuilder={() => setIsAIGeneratorOpen(true)}
        onNavigateDomain={(dom) => setActiveDomain(dom)}
      />
    </div>
  );
}
