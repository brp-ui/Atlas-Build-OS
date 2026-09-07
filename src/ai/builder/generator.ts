import { DashboardPageSchema, WidgetConfig } from '../../studio/schema/types';

export class AIDashboardGenerator {
  /**
   * Translates natural language requests into structured DashboardPageSchemas
   * against validated existing entities and metrics.
   */
  public generateDashboardFromPrompt(prompt: string, targetWorkspaceId: string): DashboardPageSchema {
    const lower = prompt.toLowerCase();

    const isSales = lower.includes('sales') || lower.includes('pipeline') || lower.includes('crm');
    const isProject = lower.includes('project') || lower.includes('margin') || lower.includes('gross margin');
    const isCentury = lower.includes('century') || lower.includes('fire') || lower.includes('permit');
    const isPersonal = lower.includes('personal') || lower.includes('goal') || fontCheck(lower, 'finance');

    let title = 'AI Generated Executive Dashboard';
    let domain = 'command_center';
    let widgets: WidgetConfig[] = [];

    if (isSales) {
      title = 'AI Generated Sales & Pipeline Intelligence';
      domain = 'crm';
      widgets = [
        {
          id: 'ai_w_1',
          type: 'kpi',
          title: 'Pipeline Total Value',
          gridSpan: 2,
          dataSourceKey: 'opportunities',
          kpiConfig: { metricKey: 'value', isCurrency: true, trend: 'up' },
        },
        {
          id: 'ai_w_2',
          type: 'kpi',
          title: 'Avg Win Probability',
          gridSpan: 2,
          dataSourceKey: 'opportunities',
          kpiConfig: { metricKey: 'probability', isPercent: true, trend: 'up' },
        },
        {
          id: 'ai_w_3',
          type: 'table',
          title: 'Open Opportunity Pipeline',
          gridSpan: 4,
          dataSourceKey: 'opportunities',
          tableConfig: {
            columns: [
              { key: 'title', label: 'Opportunity Name' },
              { key: 'stage', label: 'Stage', format: 'badge' },
              { key: 'value', label: 'Value $', format: 'currency' },
              { key: 'tradeScope', label: 'Scope' },
            ],
          },
        },
      ];
    } else if (isProject) {
      title = 'AI Generated Project Margin & Risk Dashboard';
      domain = 'project_management';
      widgets = [
        {
          id: 'ai_w_gp',
          type: 'kpi',
          title: 'Gross Profit Target Variance',
          gridSpan: 2,
          dataSourceKey: 'financial_metrics',
          kpiConfig: { metricKey: 'gpPercent', target: 25.0, isPercent: true, trend: 'down' },
        },
        {
          id: 'ai_w_backlog',
          type: 'kpi',
          title: 'Active Backlog',
          gridSpan: 2,
          dataSourceKey: 'financial_metrics',
          kpiConfig: { metricKey: 'backlogValue', isCurrency: true, trend: 'up' },
        },
        {
          id: 'ai_w_proj_tbl',
          type: 'table',
          title: 'At-Risk Project Portfolio (<30% Margin)',
          gridSpan: 4,
          dataSourceKey: 'projects',
          tableConfig: {
            columns: [
              { key: 'code', label: 'Project #' },
              { key: 'title', label: 'Project Name' },
              { key: 'grossMarginPercent', label: 'Gross Margin %', format: 'percent' },
              { key: 'contractValue', label: 'Contract $', format: 'currency' },
              { key: 'health', label: 'Health', format: 'badge' },
            ],
          },
        },
      ];
    } else {
      title = `AI Generated Dashboard for ${targetWorkspaceId}`;
      widgets = [
        {
          id: 'ai_gen_kpi1',
          type: 'kpi',
          title: 'Core Revenue Metric',
          gridSpan: 2,
          dataSourceKey: 'financial_metrics',
          kpiConfig: { metricKey: 'revenue', isCurrency: true, trend: 'up' },
        },
        {
          id: 'ai_gen_ops',
          type: 'operational',
          title: 'Priority Actions & Tasks',
          gridSpan: 2,
          dataSourceKey: 'change_orders',
          operationalConfig: { entityType: 'change_order' },
        },
      ];
    }

    return {
      id: `dash_ai_${Date.now()}`,
      workspaceId: targetWorkspaceId,
      domain,
      title,
      description: `Generated dynamically by Atlas AI Builder from prompt: "${prompt}"`,
      isCustomView: true,
      viewName: 'AI Generated View',
      theme: 'indigo',
      globalFilters: {},
      sections: [
        {
          id: 'sec_ai_main',
          title: 'AI Generated Overview',
          panels: [
            {
              id: 'pnl_ai_1',
              title: 'Generated Panel',
              widgets,
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

function fontCheck(str: string, term: string): boolean {
  return str.includes(term);
}
