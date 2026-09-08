import { describe, it, expect } from 'vitest';
import { GanttTask } from './GanttChart';

describe('Gantt Schedule Milestone Logic', () => {
  const sampleTasks: GanttTask[] = [
    {
      id: 'g-1',
      title: 'Site Preparation',
      startDate: '2026-03-01',
      endDate: '2026-03-10',
      progress: 100,
      criticalPath: true,
      dependencies: [],
      assignee: 'Bob',
      stage: 'Preconstruction',
    },
    {
      id: 'g-2',
      title: 'Concrete Slab Pour',
      startDate: '2026-03-11',
      endDate: '2026-03-20',
      progress: 50,
      criticalPath: true,
      dependencies: ['g-1'],
      assignee: 'Alice',
      stage: 'Construction',
    },
  ];

  it('identifies critical path tasks', () => {
    const criticals = sampleTasks.filter((t) => t.criticalPath);
    expect(criticals.length).toBe(2);
  });

  it('filters tasks by construction stage', () => {
    const precon = sampleTasks.filter((t) => t.stage === 'Preconstruction');
    expect(precon.length).toBe(1);
    expect(precon[0].id).toBe('g-1');
  });
});
