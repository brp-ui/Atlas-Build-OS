import { ProjectEntity } from './types';

export interface WIPRow {
  projectId: string;
  projectCode: string;
  projectTitle: string;
  revisedContract: number;
  revisedBudget: number;
  actualCostToDate: number;
  percentComplete: number; // 0 - 100%
  earnedRevenue: number;
  billedToDate: number;
  overbilled: number;
  underbilled: number;
  projectedGrossProfit: number;
  projectedGrossProfitPct: number;
}

export function calculateWIP(
  project: ProjectEntity,
  billedToDate: number,
  percentCompleteOverride?: number
): WIPRow {
  const revisedContract = project.contractValue;
  const revisedBudget = project.revisedBudget || project.actualCost * 1.25;
  const actualCostToDate = project.actualCost;

  let percentComplete = 0;
  if (percentCompleteOverride !== undefined) {
    percentComplete = percentCompleteOverride;
  } else if (revisedBudget > 0) {
    percentComplete = Math.min(100, Math.round((actualCostToDate / revisedBudget) * 100));
  }

  const earnedRevenue = Math.round(revisedContract * (percentComplete / 100));
  const overbilled = billedToDate > earnedRevenue ? billedToDate - earnedRevenue : 0;
  const underbilled = earnedRevenue > billedToDate ? earnedRevenue - billedToDate : 0;

  const projectedGrossProfit = revisedContract - revisedBudget;
  const projectedGrossProfitPct = revisedContract > 0 ? (projectedGrossProfit / revisedContract) * 100 : 0;

  return {
    projectId: project.id,
    projectCode: project.code,
    projectTitle: project.title,
    revisedContract,
    revisedBudget,
    actualCostToDate,
    percentComplete,
    earnedRevenue,
    billedToDate,
    overbilled,
    underbilled,
    projectedGrossProfit,
    projectedGrossProfitPct,
  };
}
