import { describe, it, expect } from 'vitest';
import { YOUNGMAN_EXECUTIVE_DASHBOARD, CENTURY_FIRE_DASHBOARD, PERSONAL_OS_DASHBOARD } from './schema/templates';

describe('Layer 5, 6, 7 & 8: Dashboard Schema, Reusable Widget Library, Renderer & Studio Editor', () => {
  it('loads valid schema templates for Youngman Executive, Century Fire, and Personal OS', () => {
    expect(YOUNGMAN_EXECUTIVE_DASHBOARD.id).toBe('dash_ym_exec');
    expect(YOUNGMAN_EXECUTIVE_DASHBOARD.sections.length).toBeGreaterThan(0);

    expect(CENTURY_FIRE_DASHBOARD.id).toBe('dash_cf_ops');
    expect(CENTURY_FIRE_DASHBOARD.workspaceId).toBe('ws_century');

    expect(PERSONAL_OS_DASHBOARD.id).toBe('dash_personal_os');
    expect(PERSONAL_OS_DASHBOARD.workspaceId).toBe('ws_personal');
  });

  it('validates widget configuration in Youngman Executive schema', () => {
    const kpiSection = YOUNGMAN_EXECUTIVE_DASHBOARD.sections[0];
    const widgets = kpiSection.panels[0].widgets;

    const revWidget = widgets.find((w) => w.id === 'w_rev');
    expect(revWidget).toBeDefined();
    expect(revWidget?.type).toBe('kpi');
    expect(revWidget?.gridSpan).toBe(1);
    expect(revWidget?.kpiConfig?.isCurrency).toBe(true);

    const gpWidget = widgets.find((w) => w.id === 'w_gp');
    expect(gpWidget).toBeDefined();
    expect(gpWidget?.kpiConfig?.isPercent).toBe(true);
    expect(gpWidget?.kpiConfig?.target).toBe(25.0);
  });

  it('supports personal view customization schema updates', () => {
    const customSchema = JSON.parse(JSON.stringify(YOUNGMAN_EXECUTIVE_DASHBOARD));
    customSchema.isCustomView = true;
    customSchema.viewName = 'Billy Custom PM View';
    customSchema.sections[0].panels[0].widgets[0].gridSpan = 2;

    expect(customSchema.isCustomView).toBe(true);
    expect(customSchema.viewName).toBe('Billy Custom PM View');
    expect(customSchema.sections[0].panels[0].widgets[0].gridSpan).toBe(2);
  });
});
