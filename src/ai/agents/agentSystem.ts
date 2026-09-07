export type AgentType =
  | 'executive'
  | 'sales'
  | 'estimating'
  | 'project'
  | 'financial'
  | 'schedule'
  | 'procurement'
  | 'risk'
  | 'personal';

export interface AgentRecommendation {
  id: string;
  agentType: AgentType;
  title: string;
  insight: string;
  recommendedAction: string;
  impactScore: 'high' | 'medium' | 'low';
  requiresHumanApproval: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export class AIAgentSystem {
  private recommendations: AgentRecommendation[] = [
    {
      id: 'rec_1',
      agentType: 'risk',
      title: 'Gross Margin Protection Intervention',
      insight: 'Oakridge Expansion projected GP is 19.58% (below target 25%). Steel markup was higher than estimated.',
      recommendedAction: 'Issue Value-Engineering Submittal for joist layout & request $18.5K CO from Owner.',
      impactScore: 'high',
      requiresHumanApproval: true,
      status: 'pending',
      createdAt: '2026-03-02T12:30:00Z',
    },
    {
      id: 'rec_2',
      agentType: 'sales',
      title: 'Follow-Up Pipeline Acceleration',
      insight: 'Summit Office Park proposal ($275,000) has been open 20 days with 75% win probability.',
      recommendedAction: 'Schedule executive call with Owner Representative to finalize contract terms.',
      impactScore: 'medium',
      requiresHumanApproval: true,
      status: 'pending',
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'rec_3',
      agentType: 'financial',
      title: 'A/R Collections Optimization',
      insight: 'Metro Medical Center invoice ($142,000) reached 45 days past billing date.',
      recommendedAction: 'Send automated courtesy reminder and notify PM Dave Miller for site follow-up.',
      impactScore: 'medium',
      requiresHumanApproval: true,
      status: 'pending',
      createdAt: '2026-03-03T08:00:00Z',
    },
  ];

  public getRecommendations(): AgentRecommendation[] {
    return [...this.recommendations];
  }

  public approveRecommendation(id: string): AgentRecommendation | undefined {
    const target = this.recommendations.find((r) => r.id === id);
    if (target) {
      target.status = 'approved';
    }
    return target;
  }

  public rejectRecommendation(id: string): AgentRecommendation | undefined {
    const target = this.recommendations.find((r) => r.id === id);
    if (target) {
      target.status = 'rejected';
    }
    return target;
  }
}
