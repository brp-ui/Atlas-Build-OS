import { ProjectEntity, OpportunityEntity } from '../data/types';
import { NotificationQueue, SystemNotification } from '../notifications/queue';

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: 'opportunity_submitted' | 'projected_gp_drop' | 'permit_expiration_near' | 'rfi_overdue';
  condition: (data: any) => boolean;
  action: (data: any, notificationQueue: NotificationQueue) => SystemNotification;
}

export class AutomationEngine {
  private notificationQueue: NotificationQueue;
  private rules: AutomationRule[] = [];

  constructor(notificationQueue: NotificationQueue) {
    this.notificationQueue = notificationQueue;
    this.registerDefaultRules();
  }

  private registerDefaultRules() {
    // Rule 1: GP % drops below 25% -> Risk Alert & Executive Notification
    this.rules.push({
      id: 'rule_gp_drop',
      name: 'Projected Gross Margin Risk Guard',
      triggerEvent: 'projected_gp_drop',
      condition: (project: ProjectEntity) => project.grossMarginPercent < 25.0,
      action: (project: ProjectEntity, queue: NotificationQueue) => {
        return queue.addNotification({
          workspaceId: project.workspaceId,
          priority: 'critical',
          source: 'automation',
          title: `CRITICAL: Projected Gross Margin Drop on ${project.code}`,
          message: `Projected GP% on "${project.title}" dropped to ${project.grossMarginPercent.toFixed(1)}% (below 25% threshold).`,
          ownerId: project.projectManager,
          relatedRecordId: project.id,
          relatedRecordType: 'project',
          actionsAllowed: ['assign', 'escalate', 'open_record', 'create_task'],
        });
      },
    });

    // Rule 2: Bid Submitted -> Schedule follow-up task
    this.rules.push({
      id: 'rule_bid_followup',
      name: 'Bid Submission Follow-Up Engine',
      triggerEvent: 'opportunity_submitted',
      condition: (opp: OpportunityEntity) => opp.stage === 'submitted',
      action: (opp: OpportunityEntity, queue: NotificationQueue) => {
        return queue.addNotification({
          workspaceId: opp.workspaceId,
          priority: 'high',
          source: 'automation',
          title: `Follow-Up Required: ${opp.title}`,
          message: `Bid for "${opp.title}" ($${new Intl.NumberFormat().format(opp.value)}) was submitted 3 days ago. Check status with customer.`,
          ownerId: opp.ownerId,
          relatedRecordId: opp.id,
          relatedRecordType: 'opportunity',
          actionsAllowed: ['dismiss', 'snooze', 'open_record', 'create_task'],
        });
      },
    });
  }

  /**
   * Evaluates rules against entity events
   */
  public evaluateEvent(triggerEvent: AutomationRule['triggerEvent'], data: any): SystemNotification[] {
    const triggeredNotifications: SystemNotification[] = [];
    const matchingRules = this.rules.filter((r) => r.triggerEvent === triggerEvent);

    for (const rule of matchingRules) {
      if (rule.condition(data)) {
        const notif = rule.action(data, this.notificationQueue);
        triggeredNotifications.push(notif);
      }
    }

    return triggeredNotifications;
  }
}
