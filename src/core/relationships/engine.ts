import { BaseEntity } from '../data/types';

export interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  targetEntityId: string;
  targetEntityType: string;
  relationshipType: 'child' | 'parent' | 'dependency' | 'association';
}

export class RelationshipEngine {
  private relationships: EntityRelationship[] = [
    // Youngman Project 101 relationships
    {
      id: 'rel_1',
      sourceEntityId: 'prj_ym_101',
      sourceEntityType: 'project',
      targetEntityId: 'rfi_ym_1',
      targetEntityType: 'rfi',
      relationshipType: 'child',
    },
    {
      id: 'rel_2',
      sourceEntityId: 'prj_ym_101',
      sourceEntityType: 'project',
      targetEntityId: 'co_ym_1',
      targetEntityType: 'change_order',
      relationshipType: 'child',
    },
    // Century Fire Project 201 relationships
    {
      id: 'rel_3',
      sourceEntityId: 'prj_cf_201',
      sourceEntityType: 'project',
      targetEntityId: 'rfi_cf_1',
      targetEntityType: 'rfi',
      relationshipType: 'child',
    },
    {
      id: 'rel_4',
      sourceEntityId: 'prj_cf_201',
      sourceEntityType: 'project',
      targetEntityId: 'pmt_cf_1',
      targetEntityType: 'permit',
      relationshipType: 'child',
    },
  ];

  public addRelationship(rel: Omit<EntityRelationship, 'id'>): EntityRelationship {
    const newRel: EntityRelationship = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...rel,
    };
    this.relationships.push(newRel);
    return newRel;
  }

  public getRelatedEntityIds(entityId: string, targetType?: string): string[] {
    return this.relationships
      .filter(
        (r) =>
          (r.sourceEntityId === entityId || r.targetEntityId === entityId) &&
          (!targetType || r.targetEntityType === targetType || r.sourceEntityType === targetType)
      )
      .map((r) => (r.sourceEntityId === entityId ? r.targetEntityId : r.sourceEntityId));
  }

  public getProjectRelatedSummary(projectId: string): {
    rfiCount: number;
    changeOrderCount: number;
    permitCount: number;
  } {
    const childRels = this.relationships.filter((r) => r.sourceEntityId === projectId);
    return {
      rfiCount: childRels.filter((r) => r.targetEntityType === 'rfi').length,
      changeOrderCount: childRels.filter((r) => r.targetEntityType === 'change_order').length,
      permitCount: childRels.filter((r) => r.targetEntityType === 'permit').length,
    };
  }
}
