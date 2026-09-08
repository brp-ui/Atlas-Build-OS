import { describe, it, expect } from 'vitest';
import { calculateWIP } from './wipEngine';
import { ProjectEntity } from './types';

describe('WIP Engine Calculations', () => {
  const mockProject: ProjectEntity = {
    id: 'p-101',
    workspaceId: 'ws_youngman',
    type: 'project',
    code: 'YNG-101',
    title: 'Commercial Office Tower',
    status: 'active',
    ownerId: 'u-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerId: 'cust-1',
    contractValue: 1000000,
    originalBudget: 800000,
    revisedBudget: 800000,
    committedCost: 400000,
    actualCost: 400000,
    projectedGP: 200000,
    grossMarginPercent: 20,
    stage: 'construction',
    startDate: '2026-01-01',
    targetCompletionDate: '2026-12-31',
    projectManager: 'Mike Smith',
    health: 'healthy',
  };

  it('calculates earned revenue based on cost percentage of completion', () => {
    // Actual cost 400k / revised budget 800k = 50% completion
    // Earned revenue = 50% * 1M = 500k
    const wip = calculateWIP(mockProject, 500000);
    expect(wip.percentComplete).toBe(50);
    expect(wip.earnedRevenue).toBe(500000);
    expect(wip.overbilled).toBe(0);
    expect(wip.underbilled).toBe(0);
  });

  it('calculates overbilling correctly when billed > earned', () => {
    // Billed 600k > earned 500k = 100k overbilled
    const wip = calculateWIP(mockProject, 600000);
    expect(wip.overbilled).toBe(100000);
    expect(wip.underbilled).toBe(0);
  });

  it('calculates underbilling correctly when earned > billed', () => {
    // Billed 350k < earned 500k = 150k underbilled
    const wip = calculateWIP(mockProject, 350000);
    expect(wip.underbilled).toBe(150000);
    expect(wip.overbilled).toBe(0);
  });
});
