import { User, Workspace, Role, RoleType, SavedView, PersonalPreference, Company } from './types';

export const INITIAL_USER: User = {
  id: 'usr_billy',
  name: 'Billy Palumbo',
  email: 'billy.palumbo@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  defaultWorkspaceId: 'ws_youngman',
  activeWorkspaceId: 'ws_youngman',
  activeRoleId: 'executive',
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'cmp_youngman',
    name: 'Youngman Services',
    industry: 'General Construction & Roofing',
    activeWorkspaces: ['ws_youngman'],
  },
  {
    id: 'cmp_century',
    name: 'Century Fire',
    industry: 'Fire Protection & Life Safety',
    activeWorkspaces: ['ws_century'],
  },
  {
    id: 'cmp_personal',
    name: 'Personal OS & Holdings',
    industry: 'Personal Management & Investments',
    activeWorkspaces: ['ws_personal'],
  },
];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws_youngman',
    name: 'Youngman Services',
    code: 'YOUNGMAN',
    type: 'youngman',
    description: 'General Contracting, Commercial Services & Estimating',
    companyId: 'cmp_youngman',
    strictDataBoundary: true,
    allowedDomains: [
      'command_center',
      'crm',
      'estimating',
      'project_management',
      'field_operations',
      'financial_management',
      'procurement',
      'subcontractors',
      'documents',
      'analytics',
      'automations',
      'studio',
    ],
  },
  {
    id: 'ws_century',
    name: 'Century Fire',
    code: 'CENTURY',
    type: 'century_fire',
    description: 'Fire Protection, Sprinkler Systems, AHJ Permits & Inspections',
    companyId: 'cmp_century',
    strictDataBoundary: true,
    allowedDomains: [
      'command_center',
      'opportunities',
      'bids',
      'projects',
      'design',
      'permitting',
      'material',
      'field',
      'inspections',
      'billing',
      'osr',
      'percent_complete',
      'closeout',
      'studio',
    ],
  },
  {
    id: 'ws_personal',
    name: 'Atlas Personal OS',
    code: 'PERSONAL',
    type: 'personal',
    description: 'Morning Brief, Personal Calendar, Personal Finance & Life Goals',
    companyId: 'cmp_personal',
    strictDataBoundary: true,
    allowedDomains: [
      'command_center',
      'morning_brief',
      'calendar',
      'personal_finance',
      'investments',
      'goals',
      'tasks',
      'studio',
    ],
  },
];

export const INITIAL_ROLES: Role[] = [
  {
    id: 'executive',
    name: 'Executive / Owner',
    permissions: [
      { domain: '*', actions: ['read', 'create', 'update', 'delete', 'admin'] }
    ]
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    permissions: [
      { domain: 'projects', actions: ['read', 'create', 'update'] },
      { domain: 'rfis', actions: ['read', 'create', 'update', 'delete'] },
      { domain: 'submittals', actions: ['read', 'create', 'update'] },
      { domain: 'field', actions: ['read', 'create', 'update'] },
      { domain: 'financials', actions: ['read'] },
    ]
  },
  {
    id: 'superintendent',
    name: 'Superintendent',
    permissions: [
      { domain: 'field', actions: ['read', 'create', 'update'] },
      { domain: 'projects', actions: ['read'] },
      { domain: 'inspections', actions: ['read', 'create', 'update'] },
      { domain: 'safety', actions: ['read', 'create', 'update'] },
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting / Controller',
    permissions: [
      { domain: 'financials', actions: ['read', 'create', 'update', 'delete', 'admin'] },
      { domain: 'billing', actions: ['read', 'create', 'update', 'delete'] },
      { domain: 'procurement', actions: ['read', 'create', 'update'] },
    ]
  },
  {
    id: 'custom',
    name: 'Custom Billy View',
    permissions: [
      { domain: '*', actions: ['read', 'create', 'update', 'delete', 'admin'] }
    ]
  }
];

export class IdentityManager {
  private currentUser: User;
  private workspaces: Workspace[];
  private activeWorkspace: Workspace;
  private activeRole: Role;
  private roles: Role[];
  private preferences: PersonalPreference;

  constructor() {
    this.currentUser = { ...INITIAL_USER };
    this.workspaces = [...INITIAL_WORKSPACES];
    this.roles = [...INITIAL_ROLES];

    const initialWs = this.workspaces.find(w => w.id === this.currentUser.activeWorkspaceId) || this.workspaces[0];
    this.activeWorkspace = initialWs;
    this.activeRole = this.roles.find(r => r.id === this.currentUser.activeRoleId) || this.roles[0];

    this.preferences = {
      userId: this.currentUser.id,
      theme: 'dark',
      density: 'comfortable',
      sidebarCollapsed: false,
      defaultWorkspaceId: this.currentUser.defaultWorkspaceId,
      notificationsEnabled: true,
    };
  }

  public getCurrentUser(): User {
    return { ...this.currentUser };
  }

  public getActiveWorkspace(): Workspace {
    return { ...this.activeWorkspace };
  }

  public getWorkspaces(): Workspace[] {
    return [...this.workspaces];
  }

  public getActiveRole(): Role {
    return { ...this.activeRole };
  }

  public getRoles(): Role[] {
    return [...this.roles];
  }

  public switchWorkspace(workspaceId: string): Workspace {
    const targetWs = this.workspaces.find(w => w.id === workspaceId);
    if (!targetWs) {
      throw new Error(`Workspace ${workspaceId} not found`);
    }
    this.currentUser.activeWorkspaceId = targetWs.id;
    this.activeWorkspace = targetWs;
    return { ...this.activeWorkspace };
  }

  public switchRole(roleId: RoleType): Role {
    const targetRole = this.roles.find(r => r.id === roleId);
    if (!targetRole) {
      throw new Error(`Role ${roleId} not found`);
    }
    this.currentUser.activeRoleId = targetRole.id;
    this.activeRole = targetRole;
    return { ...this.activeRole };
  }

  /**
   * Enforces strict workspace data boundary.
   * Returns true only if entity belong to the active workspace.
   */
  public isEntityInActiveWorkspace(entityWorkspaceId: string): boolean {
    if (this.activeWorkspace.strictDataBoundary) {
      return entityWorkspaceId === this.activeWorkspace.id;
    }
    return true;
  }

  /**
   * Check if action on domain is allowed for active role
   */
  public hasPermission(domain: string, action: 'read' | 'create' | 'update' | 'delete' | 'admin'): boolean {
    const wildcardPerm = this.activeRole.permissions.find(p => p.domain === '*');
    if (wildcardPerm && wildcardPerm.actions.includes(action)) {
      return true;
    }
    const domainPerm = this.activeRole.permissions.find(p => p.domain === domain);
    return !!(domainPerm && domainPerm.actions.includes(action));
  }
}
