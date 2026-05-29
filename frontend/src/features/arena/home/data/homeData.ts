import {
  computeNodeStatus,
  getCurrentLevel,
  getTotalXp,
  MOCK_PROGRESS,
  SKILL_EDGES,
  SKILL_NODES,
  type NodeDomain,
  type NodeStatus,
  type SkillNode,
} from '../../skills/data/progressionConfig';

export const AUTONOMY_SCORE = 74;

export interface LastSession {
  incidentId: string;
  ticketRouteId: string;
  title: string;
  domain: NodeDomain;
  lastActive: string;
  hintsUsed: number;
  progressPercent: number;
  vmActive: boolean;
}

export interface RecommendedIncident {
  node: SkillNode;
  incidentId: string;
  ticketRouteId: string;
  reason: string;
  status: NodeStatus;
}

export interface ProgressSnapshot {
  totalXp: number;
  levelLabel: string;
  levelColor: string;
  xpInLevel: number;
  xpToNext: number;
  completedLabs: number;
  totalLabs: number;
  inProgressLab: string | null;
  domainProgress: { domain: NodeDomain; done: number; total: number }[];
}

function incidentRouteId(incidentId: string): string {
  return incidentId.replace(/^INC-/, '');
}

function findNodeById(nodeId: string): SkillNode {
  const node = SKILL_NODES.find((n) => n.id === nodeId);
  if (!node) throw new Error(`Unknown skill node: ${nodeId}`);
  return node;
}

export function getLastSession(): LastSession | null {
  const inProgress = MOCK_PROGRESS.find((p) => p.status === 'in-progress');
  if (!inProgress) return null;

  const node = findNodeById(inProgress.nodeId);
  if (!node.incidentId) return null;

  return {
    incidentId: node.incidentId,
    ticketRouteId: incidentRouteId(node.incidentId),
    title: node.title,
    domain: node.domain,
    lastActive: "Aujourd'hui, 09:42",
    hintsUsed: inProgress.hintsUsed ?? 0,
    progressPercent: 62,
    vmActive: true,
  };
}

export function getRecommendedIncident(): RecommendedIncident | null {
  const inProgressNodeId = MOCK_PROGRESS.find(
    (p) => p.status === 'in-progress',
  )?.nodeId;

  const available = MOCK_PROGRESS.filter((p) => p.status === 'available');
  if (available.length > 0) {
    const node = findNodeById(available[0].nodeId);
    if (!node.incidentId) return null;
    return {
      node,
      incidentId: node.incidentId,
      ticketRouteId: incidentRouteId(node.incidentId),
      reason: 'Branche parallèle · prérequis validés',
      status: 'available',
    };
  }

  if (inProgressNodeId) {
    const nextTargets = SKILL_EDGES.filter(
      (edge) => edge.source === inProgressNodeId,
    ).map((edge) => edge.target);

    for (const targetId of nextTargets) {
      const status = computeNodeStatus(targetId, MOCK_PROGRESS, SKILL_EDGES);
      if (status === 'locked' || status === 'available') {
        const node = findNodeById(targetId);
        if (!node.incidentId) continue;
        const current = findNodeById(inProgressNodeId);
        return {
          node,
          incidentId: node.incidentId,
          ticketRouteId: incidentRouteId(node.incidentId),
          reason: `Prochaine étape après « ${current.title} »`,
          status,
        };
      }
    }
  }

  return null;
}

export function getProgressSnapshot(): ProgressSnapshot {
  const totalXp = getTotalXp(MOCK_PROGRESS);
  const level = getCurrentLevel(totalXp);
  const completedLabs = MOCK_PROGRESS.filter(
    (p) => p.status === 'completed',
  ).length;
  const inProgress = MOCK_PROGRESS.find((p) => p.status === 'in-progress');
  const inProgressLab = inProgress
    ? findNodeById(inProgress.nodeId).title
    : null;

  const domains: NodeDomain[] = ['linux', 'web', 'reseau', 'securite', 'cloud'];
  const domainProgress = domains.map((domain) => {
    const nodes = SKILL_NODES.filter((n) => n.domain === domain);
    const done = nodes.filter((n) => {
      const status = computeNodeStatus(n.id, MOCK_PROGRESS, SKILL_EDGES);
      return status === 'completed';
    }).length;
    return { domain, done, total: nodes.length };
  });

  return {
    totalXp,
    levelLabel: level.level,
    levelColor: level.color,
    xpInLevel: totalXp - level.min,
    xpToNext: level.max - level.min + 1,
    completedLabs,
    totalLabs: SKILL_NODES.length,
    inProgressLab,
    domainProgress: domainProgress.filter((d) => d.total > 0),
  };
}

