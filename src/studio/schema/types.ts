export type WidgetType = 'kpi' | 'table' | 'chart' | 'operational' | 'action_queue' | 'ai_insights';

export type ChartType = 'bar' | 'line' | 'pipeline' | 'forecast' | 'variance' | 'waterfall';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  gridSpan: 1 | 2 | 3 | 4; // Columns in 4-col grid
  heightPx?: number;
  dataSourceKey: string; // Key in workspace state / domain entity store
  chartType?: ChartType;
  kpiConfig?: {
    metricKey: string;
    target?: number;
    unit?: string;
    isCurrency?: boolean;
    isPercent?: boolean;
    comparisonKey?: string;
    trend?: 'up' | 'down' | 'neutral';
    statusThreshold?: { warning: number; critical: number };
  };
  tableConfig?: {
    columns: Array<{ key: string; label: string; format?: 'currency' | 'percent' | 'badge' | 'date' }>;
    pageSize?: number;
  };
  operationalConfig?: {
    entityType: 'rfi' | 'change_order' | 'permit' | 'task' | 'goal' | 'submittal';
  };
  actionsAllowed?: string[];
}

export interface DashboardPanel {
  id: string;
  title: string;
  description?: string;
  widgets: WidgetConfig[];
}

export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  panels: DashboardPanel[];
}

export interface DashboardPageSchema {
  id: string;
  workspaceId: string;
  domain: string;
  title: string;
  description: string;
  roleFilter?: string; // e.g. 'executive', 'project_manager'
  isCustomView?: boolean;
  savedByUserId?: string;
  viewName?: string;
  theme: 'slate' | 'emerald' | 'amber' | 'indigo';
  globalFilters: {
    dateRange?: string;
    projectHealth?: string;
    pmFilter?: string;
  };
  sections: DashboardSection[];
  createdAt: string;
  updatedAt: string;
}
