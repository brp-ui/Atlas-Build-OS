import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationQueue } from './notifications/queue';
import { AutomationEngine } from './automation/engine';
import { AIAgentSystem } from '../ai/agents/agentSystem';
import { AIDashboardGenerator } from '../ai/builder/generator';
import { SAMPLE_PROJECTS, SAMPLE_OPPORTUNITIES } from './data/sampleData';

describe('Layer 9 & 10: Automation Engine, Notification Queue & AI Agent Architecture', () => {
  let notificationQueue: NotificationQueue;
  let automationEngine: AutomationEngine;
  let agentSystem: AIAgentSystem;
  let aiGenerator: AIDashboardGenerator;

  beforeEach(() => {
    notificationQueue = new NotificationQueue();
    automationEngine = new AutomationEngine(notificationQueue);
    agentSystem = new AIAgentSystem();
    aiGenerator = new AIDashboardGenerator();
  });

  it('triggers critical alert when project gross margin drops below 25%', () => {
    const atRiskProject = SAMPLE_PROJECTS.find((p) => p.grossMarginPercent < 25.0);
    expect(atRiskProject).toBeDefined();

    const triggered = automationEngine.evaluateEvent('projected_gp_drop', atRiskProject);
    expect(triggered.length).toBe(1);
    expect(triggered[0].priority).toBe('critical');
    expect(triggered[0].title).toContain('CRITICAL');

    // Verify it exists in workspace notification queue
    const queueNotifs = notificationQueue.getNotificationsForWorkspace(atRiskProject!.workspaceId);
    expect(queueNotifs.some((n) => n.id === triggered[0].id)).toBe(true);
  });

  it('triggers follow-up task notification when bid is submitted', () => {
    const opp = { ...SAMPLE_OPPORTUNITIES[1], stage: 'submitted' as const };
    const triggered = automationEngine.evaluateEvent('opportunity_submitted', opp);

    expect(triggered.length).toBe(1);
    expect(triggered[0].title).toContain('Follow-Up Required');
  });

  it('supports AI agent recommendations approval and rejection workflow', () => {
    const recs = agentSystem.getRecommendations();
    expect(recs.length).toBeGreaterThan(0);

    const approved = agentSystem.approveRecommendation(recs[0].id);
    expect(approved?.status).toBe('approved');
  });

  it('AI Dashboard Builder generates valid DashboardPageSchema from natural language prompt', () => {
    const prompt = 'Create a project executive dashboard for Youngman Services showing projects over $100K with less than 30% gross margin';
    const generated = aiGenerator.generateDashboardFromPrompt(prompt, 'ws_youngman');

    expect(generated.id).toContain('dash_ai_');
    expect(generated.workspaceId).toBe('ws_youngman');
    expect(generated.sections.length).toBe(1);
    expect(generated.sections[0].panels[0].widgets.length).toBeGreaterThan(0);
  });
});
