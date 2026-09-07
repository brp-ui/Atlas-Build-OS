export type PriorityLevel = 'critical' | 'high' | 'normal' | 'low';

export interface SystemNotification {
  id: string;
  workspaceId: string;
  priority: PriorityLevel;
  source: 'automation' | 'ai_agent' | 'rfi' | 'financial' | 'system';
  title: string;
  message: string;
  ownerId: string;
  dueAt?: string;
  status: 'unread' | 'read' | 'snoozed' | 'resolved' | 'escalated';
  escalationLevel: number; // 0 = standard, 1 = PM, 2 = Exec
  relatedRecordId?: string;
  relatedRecordType?: string;
  actionsAllowed: string[];
  createdAt: string;
}

export class NotificationQueue {
  private notifications: SystemNotification[] = [
    {
      id: 'notif_1',
      workspaceId: 'ws_youngman',
      priority: 'critical',
      source: 'automation',
      title: 'Gross Margin Risk Alert: Oakridge Expansion',
      message: 'Projected Gross Margin dropped to 19.58% due to steel buyout overrun.',
      ownerId: 'Sarah Jenkins',
      status: 'unread',
      escalationLevel: 1,
      relatedRecordId: 'prj_ym_102',
      relatedRecordType: 'project',
      actionsAllowed: ['assign', 'escalate', 'open_record', 'create_task'],
      createdAt: '2026-03-02T12:00:00Z',
    },
    {
      id: 'notif_2',
      workspaceId: 'ws_century',
      priority: 'high',
      source: 'rfi',
      title: 'AHJ Backflow Clearance Required',
      message: 'RFI #1 on Highland Towers waiting on Fire Marshal review.',
      ownerId: 'Marcus Vance',
      status: 'unread',
      escalationLevel: 0,
      relatedRecordId: 'rfi_cf_1',
      relatedRecordType: 'rfi',
      actionsAllowed: ['dismiss', 'open_record', 'snooze'],
      createdAt: '2026-03-01T11:00:00Z',
    },
  ];

  public addNotification(
    notif: Omit<SystemNotification, 'id' | 'createdAt' | 'status' | 'escalationLevel'>
  ): SystemNotification {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'unread',
      escalationLevel: 0,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  public getNotificationsForWorkspace(workspaceId: string): SystemNotification[] {
    return this.notifications.filter((n) => n.workspaceId === workspaceId);
  }

  public updateStatus(id: string, status: SystemNotification['status']): SystemNotification | undefined {
    const target = this.notifications.find((n) => n.id === id);
    if (target) {
      target.status = status;
    }
    return target;
  }

  public escalateNotification(id: string): SystemNotification | undefined {
    const target = this.notifications.find((n) => n.id === id);
    if (target) {
      target.escalationLevel += 1;
      target.priority = 'critical';
      target.status = 'escalated';
    }
    return target;
  }
}
