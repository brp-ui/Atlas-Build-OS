export type EntityType =
  | 'company'
  | 'customer'
  | 'contact'
  | 'lead'
  | 'opportunity'
  | 'estimate'
  | 'proposal'
  | 'project'
  | 'contract'
  | 'change_order'
  | 'rfi'
  | 'submittal'
  | 'schedule'
  | 'task'
  | 'issue'
  | 'inspection'
  | 'permit'
  | 'invoice'
  | 'payment'
  | 'purchase_order'
  | 'subcontract'
  | 'vendor'
  | 'employee'
  | 'asset'
  | 'document'
  | 'risk'
  | 'notification'
  | 'goal'
  | 'metric';

export interface BaseEntity {
  id: string;
  workspaceId: string;
  type: EntityType;
  title: string;
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  aiContext?: string;
  tags?: string[];
}

export interface ProjectEntity extends BaseEntity {
  type: 'project';
  code: string;
  customerId: string;
  contractValue: number;
  originalBudget: number;
  committedCost: number;
  actualCost: number;
  projectedGP: number;
  grossMarginPercent: number;
  stage:
    | 'preconstruction'
    | 'procurement'
    | 'mobilization'
    | 'construction'
    | 'punch'
    | 'closeout'
    | 'warranty';
  startDate: string;
  targetCompletionDate: string;
  projectManager: string;
  superintendent?: string;
  health: 'healthy' | 'at_risk' | 'critical';
}

export interface OpportunityEntity extends BaseEntity {
  type: 'opportunity';
  value: number;
  stage:
    | 'lead'
    | 'qualified'
    | 'site_walk'
    | 'estimating'
    | 'proposal'
    | 'submitted'
    | 'follow_up'
    | 'awarded'
    | 'lost';
  probability: number;
  expectedCloseDate: string;
  tradeScope: string;
  customerId: string;
}

export interface EstimateEntity extends BaseEntity {
  type: 'estimate';
  opportunityId?: string;
  directCost: number;
  indirectCost: number;
  overhead: number;
  contingency: number;
  marginPercent: number;
  sellingPrice: number;
  missingTradeScopes?: string[];
}

export interface RFISchema extends BaseEntity {
  type: 'rfi';
  rfiNumber: number;
  projectId: string;
  question: string;
  answer?: string;
  assignedTo: string;
  dueDate: string;
  ballInCourt: string;
  impactsSchedule: boolean;
  impactsCost: boolean;
}

export interface SubmittalSchema extends BaseEntity {
  type: 'submittal';
  submittalNumber: number;
  projectId: string;
  specSection: string;
  vendorId: string;
  dueDate: string;
  reviewStatus: 'pending' | 'approved' | 'approved_as_noted' | 'rejected' | 'resubmit';
}

export interface ChangeOrderEntity extends BaseEntity {
  type: 'change_order';
  coNumber: number;
  projectId: string;
  amount: number;
  scheduleImpactDays: number;
  approvalStatus: 'draft' | 'submitted' | 'approved' | 'rejected';
  reason: string;
}

export interface PermitEntity extends BaseEntity {
  type: 'permit';
  projectId: string;
  permitNumber: string;
  ahjName: string; // Authority Having Jurisdiction (e.g., City Fire Dept)
  status: 'applied' | 'ahj_review' | 'approved' | 'issued' | 'expired';
  expirationDate: string;
}

export interface PersonalGoalEntity extends BaseEntity {
  type: 'goal';
  category: 'fitness' | 'wealth' | 'learning' | 'family' | 'business';
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
}

export interface FinancialSummaryEntity extends BaseEntity {
  type: 'metric';
  revenue: number;
  grossProfit: number;
  gpPercent: number;
  arExposure: number;
  apExposure: number;
  backlogValue: number;
  cashOnHand: number;
}
