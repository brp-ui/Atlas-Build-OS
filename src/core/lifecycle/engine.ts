import { OpportunityEntity, ProjectEntity } from '../data/types';
import { RelationshipEngine } from '../relationships/engine';

export type OpportunityStage =
  | 'lead'
  | 'qualified'
  | 'site_walk'
  | 'estimating'
  | 'proposal'
  | 'submitted'
  | 'follow_up'
  | 'awarded'
  | 'lost';

export type ProjectStage =
  | 'preconstruction'
  | 'procurement'
  | 'mobilization'
  | 'construction'
  | 'punch'
  | 'closeout'
  | 'warranty';

export interface StageControls {
  stage: ProjectStage;
  visibleWidgets: string[];
  requiredDocs: string[];
  allowedActions: string[];
}

export class LifecycleEngine {
  private relationshipEngine: RelationshipEngine;

  constructor(relationshipEngine: RelationshipEngine) {
    this.relationshipEngine = relationshipEngine;
  }

  /**
   * Promotes an Opportunity through its lifecycle stages.
   * If stage becomes 'awarded', automatically generates the project entity and contract.
   */
  public promoteOpportunity(
    opportunity: OpportunityEntity,
    nextStage: OpportunityStage
  ): { updatedOpportunity: OpportunityEntity; createdProject?: ProjectEntity } {
    const updatedOpp = { ...opportunity, stage: nextStage, updatedAt: new Date().toISOString() };

    if (nextStage === 'awarded') {
      const createdProject: ProjectEntity = {
        id: `prj_${opportunity.workspaceId === 'ws_youngman' ? 'ym' : 'cf'}_${Date.now()}`,
        workspaceId: opportunity.workspaceId,
        type: 'project',
        code: `${opportunity.workspaceId === 'ws_youngman' ? 'YM' : 'CF'}-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: opportunity.title,
        status: 'active',
        stage: 'preconstruction',
        customerId: opportunity.customerId,
        contractValue: opportunity.value,
        originalBudget: Math.round(opportunity.value * 0.75),
        committedCost: 0,
        actualCost: 0,
        projectedGP: Math.round(opportunity.value * 0.25),
        grossMarginPercent: 25.0,
        startDate: new Date().toISOString().split('T')[0],
        targetCompletionDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
        projectManager: 'Billy Palumbo',
        health: 'healthy',
        ownerId: opportunity.ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiContext: `Auto-generated from Awarded Opportunity: ${opportunity.title}`,
      };

      // Register relationship in Relationship Engine
      this.relationshipEngine.addRelationship({
        sourceEntityId: opportunity.id,
        sourceEntityType: 'opportunity',
        targetEntityId: createdProject.id,
        targetEntityType: 'project',
        relationshipType: 'parent',
      });

      return { updatedOpportunity: updatedOpp, createdProject };
    }

    return { updatedOpportunity: updatedOpp };
  }

  /**
   * Get stage controls and active widget views based on Project Lifecycle stage
   */
  public getProjectStageControls(stage: ProjectStage): StageControls {
    switch (stage) {
      case 'preconstruction':
        return {
          stage,
          visibleWidgets: ['permits', 'subcontract_buyout', 'submittals', 'insurance_log', 'site_logistics'],
          requiredDocs: ['Building Permit', 'Executed Contract', 'Subcontractor Certificates of Insurance'],
          allowedActions: ['issue_subcontracts', 'submit_permits', 'create_schedule'],
        };
      case 'construction':
        return {
          stage,
          visibleWidgets: ['daily_activities', 'cost_tracker', 'schedule_milestones', 'rfis', 'change_orders', 'inspections'],
          requiredDocs: ['Daily Logs', 'Safety Meeting Minutes', 'Testing Reports'],
          allowedActions: ['submit_rfi', 'create_change_order', 'log_daily_report', 'request_inspection'],
        };
      case 'closeout':
        return {
          stage,
          visibleWidgets: ['punch_list', 'lien_releases', 'warranties', 'om_manuals', 'final_billing'],
          requiredDocs: ['Final AHJ Inspection Certificate', 'Unconditional Lien Waivers', 'Warranty Certificate'],
          allowedActions: ['complete_punch_item', 'submit_final_invoice', 'archive_project'],
        };
      default:
        return {
          stage,
          visibleWidgets: ['overview', 'cost_tracker', 'tasks'],
          requiredDocs: [],
          allowedActions: [],
        };
    }
  }
}
