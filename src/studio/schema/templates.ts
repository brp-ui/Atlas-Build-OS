import { DashboardPageSchema } from './types';

export const YOUNGMAN_EXECUTIVE_DASHBOARD: DashboardPageSchema = {
  id: 'dash_ym_exec',
  workspaceId: 'ws_youngman',
  domain: 'command_center',
  title: 'Youngman Executive Command Center',
  description: 'High-level operational, financial, and project risk overview for Youngman Services',
  theme: 'slate',
  globalFilters: {
    dateRange: 'this_quarter',
  },
  sections: [
    {
      id: 'sec_kpis',
      title: 'Executive Financial Scorecard',
      panels: [
        {
          id: 'pnl_kpi_1',
          title: 'Key Financial Metrics',
          widgets: [
            {
              id: 'w_rev',
              type: 'kpi',
              title: 'YTD Revenue',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'revenue',
                unit: '$',
                isCurrency: true,
                trend: 'up',
              },
            },
            {
              id: 'w_backlog',
              type: 'kpi',
              title: 'Active Backlog',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'backlogValue',
                target: 3000000,
                unit: '$',
                isCurrency: true,
                trend: 'up',
              },
            },
            {
              id: 'w_gp',
              type: 'kpi',
              title: 'Gross Margin %',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'gpPercent',
                target: 25.0,
                isPercent: true,
                trend: 'down',
                statusThreshold: { warning: 22, critical: 20 },
              },
            },
            {
              id: 'w_cash',
              type: 'kpi',
              title: 'Cash Exposure & Reserve',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'cashOnHand',
                unit: '$',
                isCurrency: true,
                trend: 'neutral',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sec_projects_risk',
      title: 'Project Portfolio & Risk Exposure',
      panels: [
        {
          id: 'pnl_projects',
          title: 'Active Projects Portfolio',
          widgets: [
            {
              id: 'w_project_table',
              type: 'table',
              title: 'Project Performance Matrix',
              gridSpan: 3,
              dataSourceKey: 'projects',
              tableConfig: {
                columns: [
                  { key: 'code', label: 'Project #' },
                  { key: 'title', label: 'Project Name' },
                  { key: 'stage', label: 'Stage', format: 'badge' },
                  { key: 'contractValue', label: 'Contract $', format: 'currency' },
                  { key: 'grossMarginPercent', label: 'GM %', format: 'percent' },
                  { key: 'health', label: 'Health', format: 'badge' },
                ],
              },
            },
            {
              id: 'w_action_queue',
              type: 'operational',
              title: 'Executive Decision Required',
              gridSpan: 1,
              dataSourceKey: 'change_orders',
              operationalConfig: {
                entityType: 'change_order',
              },
            },
          ],
        },
      ],
    },
  ],
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};

export const CENTURY_FIRE_DASHBOARD: DashboardPageSchema = {
  id: 'dash_cf_ops',
  workspaceId: 'ws_century',
  domain: 'command_center',
  title: 'Century Fire AHJ & Operations Hub',
  description: 'Fire sprinkler, AHJ permitting, inspection tracking & project revenue engine',
  theme: 'emerald',
  globalFilters: {
    dateRange: 'this_month',
  },
  sections: [
    {
      id: 'sec_cf_kpis',
      title: 'Fire Protection Performance Scorecard',
      panels: [
        {
          id: 'pnl_cf_kpi',
          title: 'Century Key Indicators',
          widgets: [
            {
              id: 'w_cf_rev',
              type: 'kpi',
              title: 'Century YTD Revenue',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'revenue',
                isCurrency: true,
                trend: 'up',
              },
            },
            {
              id: 'w_cf_gp',
              type: 'kpi',
              title: 'Gross Profit Margin',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'gpPercent',
                target: 30.0,
                isPercent: true,
                trend: 'up',
              },
            },
            {
              id: 'w_cf_permits',
              type: 'kpi',
              title: 'Active AHJ Permits',
              gridSpan: 1,
              dataSourceKey: 'permits',
              kpiConfig: {
                metricKey: 'activePermitCount',
                trend: 'neutral',
              },
            },
            {
              id: 'w_cf_ar',
              type: 'kpi',
              title: 'A/R Exposure',
              gridSpan: 1,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'arExposure',
                isCurrency: true,
                trend: 'neutral',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sec_cf_permits_rfis',
      title: 'AHJ Permitting & Field Inspections Queue',
      panels: [
        {
          id: 'pnl_cf_permit_list',
          title: 'Permits & AHJ Approvals',
          widgets: [
            {
              id: 'w_permit_table',
              type: 'operational',
              title: 'AHJ Permit Queue',
              gridSpan: 2,
              dataSourceKey: 'permits',
              operationalConfig: { entityType: 'permit' },
            },
            {
              id: 'w_rfi_queue',
              type: 'operational',
              title: 'Engineering RFIs',
              gridSpan: 2,
              dataSourceKey: 'rfis',
              operationalConfig: { entityType: 'rfi' },
            },
          ],
        },
      ],
    },
  ],
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};

export const PERSONAL_OS_DASHBOARD: DashboardPageSchema = {
  id: 'dash_personal_os',
  workspaceId: 'ws_personal',
  domain: 'command_center',
  title: 'Atlas Personal OS & Morning Brief',
  description: 'Daily executive brief, personal finances, investments, and quarterly goals',
  theme: 'indigo',
  globalFilters: {},
  sections: [
    {
      id: 'sec_personal_kpis',
      title: 'Personal Financial & Life Goals',
      panels: [
        {
          id: 'pnl_pers_kpis',
          title: 'Net Worth & Reserves',
          widgets: [
            {
              id: 'w_net_worth',
              type: 'kpi',
              title: 'Investable Holdings & Assets',
              gridSpan: 2,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'backlogValue',
                isCurrency: true,
                trend: 'up',
              },
            },
            {
              id: 'w_cash_reserve',
              type: 'kpi',
              title: 'Liquid Cash Reserve',
              gridSpan: 2,
              dataSourceKey: 'financial_metrics',
              kpiConfig: {
                metricKey: 'cashOnHand',
                target: 100000,
                isCurrency: true,
                trend: 'neutral',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sec_goals_tasks',
      title: 'Personal Goals & Morning Action Brief',
      panels: [
        {
          id: 'pnl_goals',
          title: 'Quarterly Strategic Goals',
          widgets: [
            {
              id: 'w_goals_list',
              type: 'operational',
              title: 'Active Life & Business Goals',
              gridSpan: 4,
              dataSourceKey: 'goals',
              operationalConfig: { entityType: 'goal' },
            },
          ],
        },
      ],
    },
  ],
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};
