import { describe, it, expect, beforeEach } from 'vitest';
import { SAMPLE_PROJECTS, SAMPLE_OPPORTUNITIES } from './sampleData';
import { RelationshipEngine } from '../relationships/engine';
import { LifecycleEngine } from '../lifecycle/engine';

describe('Layer 2, 3 & 4: Data Entities, Relationship Engine & Lifecycle Engine', () => {
  let relationshipEngine: RelationshipEngine;
  let lifecycleEngine: LifecycleEngine;

  beforeEach(() => {
    relationshipEngine = new RelationshipEngine();
    lifecycleEngine = new LifecycleEngine(relationshipEngine);
  });

  it('contains correctly formatted sample project entities for Youngman & Century Fire', () => {
    expect(SAMPLE_PROJECTS.length).toBeGreaterThan(0);
    const ymProject = SAMPLE_PROJECTS.find((p) => p.workspaceId === 'ws_youngman');
    const cfProject = SAMPLE_PROJECTS.find((p) => p.workspaceId === 'ws_century');

    expect(ymProject).toBeDefined();
    expect(ymProject?.code).toContain('YM');
    expect(cfProject).toBeDefined();
    expect(cfProject?.code).toContain('CF');
  });

  it('queries relationship links between projects, RFIs, change orders, and permits', () => {
    const ymSummary = relationshipEngine.getProjectRelatedSummary('prj_ym_101');
    expect(ymSummary.rfiCount).toBe(1);
    expect(ymSummary.changeOrderCount).toBe(1);

    const cfSummary = relationshipEngine.getProjectRelatedSummary('prj_cf_201');
    expect(cfSummary.rfiCount).toBe(1);
    expect(cfSummary.permitCount).toBe(1);
  });

  it('promotes an opportunity to Awarded and automatically generates a new Project entity without duplicate entry', () => {
    const opp = SAMPLE_OPPORTUNITIES[0];
    const { updatedOpportunity, createdProject } = lifecycleEngine.promoteOpportunity(opp, 'awarded');

    expect(updatedOpportunity.stage).toBe('awarded');
    expect(createdProject).toBeDefined();
    expect(createdProject?.contractValue).toBe(opp.value);
    expect(createdProject?.stage).toBe('preconstruction');
    expect(createdProject?.workspaceId).toBe(opp.workspaceId);

    // Verify relationship was linked
    const relatedProjectIds = relationshipEngine.getRelatedEntityIds(opp.id, 'project');
    expect(relatedProjectIds).toContain(createdProject?.id);
  });

  it('retrieves stage controls for preconstruction, construction, and closeout stages', () => {
    const preconControls = lifecycleEngine.getProjectStageControls('preconstruction');
    expect(preconControls.visibleWidgets).toContain('permits');
    expect(preconControls.visibleWidgets).toContain('subcontract_buyout');

    const constructionControls = lifecycleEngine.getProjectStageControls('construction');
    expect(constructionControls.visibleWidgets).toContain('daily_activities');
    expect(constructionControls.visibleWidgets).toContain('rfis');

    const closeoutControls = lifecycleEngine.getProjectStageControls('closeout');
    expect(closeoutControls.visibleWidgets).toContain('punch_list');
    expect(closeoutControls.visibleWidgets).toContain('warranties');
  });
});
