import { Connection } from '../types';

export function calculateStrength(
  interactionCount: number,
  daysSinceLastInteraction: number
): number {
  // Base strength on frequency
  const frequencyScore = Math.min(100, interactionCount * 2);

  // Apply time decay
  const decayFactor = Math.max(0, 1 - (daysSinceLastInteraction / 365));

  return Math.round(frequencyScore * decayFactor);
}

export function getConnection(
  userId1: string,
  userId2: string,
  connections: Connection[]
): Connection | null {
  return connections.find(
    conn =>
      (conn.userId1 === userId1 && conn.userId2 === userId2) ||
      (conn.userId1 === userId2 && conn.userId2 === userId1)
  ) || null;
}

export function getUserConnections(
  userId: string,
  connections: Connection[]
): Connection[] {
  return connections.filter(
    conn => conn.userId1 === userId || conn.userId2 === userId
  );
}
