import { describe, it, expect, beforeEach } from 'vitest';
import { IdentityManager } from './store';

describe('Layer 1: Identity & Workspace Architecture', () => {
  let identityManager: IdentityManager;

  beforeEach(() => {
    identityManager = new IdentityManager();
  });

  it('initializes with Youngman Services workspace as default active workspace', () => {
    const activeWs = identityManager.getActiveWorkspace();
    expect(activeWs.id).toBe('ws_youngman');
    expect(activeWs.code).toBe('YOUNGMAN');
    expect(activeWs.strictDataBoundary).toBe(true);
  });

  it('switches workspace to Century Fire cleanly and updates active workspace context', () => {
    identityManager.switchWorkspace('ws_century');
    const activeWs = identityManager.getActiveWorkspace();
    expect(activeWs.id).toBe('ws_century');
    expect(activeWs.code).toBe('CENTURY');
    expect(activeWs.name).toBe('Century Fire');
  });

  it('enforces strict data boundaries between Youngman and Century Fire', () => {
    // Currently active in Youngman
    expect(identityManager.isEntityInActiveWorkspace('ws_youngman')).toBe(true);
    expect(identityManager.isEntityInActiveWorkspace('ws_century')).toBe(false);

    // Switch to Century Fire
    identityManager.switchWorkspace('ws_century');
    expect(identityManager.isEntityInActiveWorkspace('ws_century')).toBe(true);
    expect(identityManager.isEntityInActiveWorkspace('ws_youngman')).toBe(false);
  });

  it('allows role switching and verifies permission rules', () => {
    identityManager.switchRole('project_manager');
    expect(identityManager.getActiveRole().id).toBe('project_manager');
    expect(identityManager.hasPermission('projects', 'update')).toBe(true);
    expect(identityManager.hasPermission('financials', 'delete')).toBe(false);

    identityManager.switchRole('executive');
    expect(identityManager.hasPermission('financials', 'delete')).toBe(true);
  });
});
