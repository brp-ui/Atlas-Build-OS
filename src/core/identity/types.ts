export type WorkspaceType = 'youngman' | 'century_fire' | 'personal' | 'ai_ceo';

export type RoleType = 'executive' | 'project_manager' | 'superintendent' | 'accounting' | 'custom';

export type ActionType = 'read' | 'create' | 'update' | 'delete' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  defaultWorkspaceId: string;
  activeWorkspaceId: string;
  activeRoleId: RoleType;
}

export interface Company {
  id: string;
  name: string;
  taxId?: string;
  industry: string;
  activeWorkspaces: string[];
}

export interface Workspace {
  id: string;
  name: string;
  code: 'YOUNGMAN' | 'CENTURY' | 'PERSONAL' | 'AI_CEO';
  type: WorkspaceType;
  description: string;
  companyId: string;
  strictDataBoundary: boolean;
  allowedDomains: string[];
}

export interface Department {
  id: string;
  workspaceId: string;
  name: string;
}

export interface PermissionGroup {
  domain: string;
  actions: ActionType[];
}

export interface Role {
  id: RoleType;
  name: string;
  permissions: PermissionGroup[];
  defaultLayoutId?: string;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  memberUserIds: string[];
}

export interface SavedView {
  id: string;
  userId: string;
  workspaceId: string;
  domain: string;
  title: string;
  isDefault: boolean;
  layoutSchemaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalPreference {
  userId: string;
  theme: 'dark' | 'light' | 'midnight';
  density: 'compact' | 'comfortable';
  sidebarCollapsed: boolean;
  defaultWorkspaceId: string;
  notificationsEnabled: boolean;
}
