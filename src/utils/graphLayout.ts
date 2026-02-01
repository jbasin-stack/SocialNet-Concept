import { User, Connection, GraphData, GraphNode, GraphLink, DistanceStrategy } from '../types';

export function buildGraphData(
  currentUserId: string,
  users: User[],
  connections: Connection[]
): GraphData {
  // Filter connections for current user
  const userConnections = connections.filter(
    conn => conn.userId1 === currentUserId || conn.userId2 === currentUserId
  );

  // Create nodes
  const nodes: GraphNode[] = [
    // Current user at center
    {
      id: currentUserId,
      name: users.find(u => u.id === currentUserId)?.name || 'You',
      user: users.find(u => u.id === currentUserId)!,
      strength: 100 // Maximum strength for center node
    },
    // Connected users
    ...userConnections.map(conn => {
      const connectedUserId = conn.userId1 === currentUserId ? conn.userId2 : conn.userId1;
      const user = users.find(u => u.id === connectedUserId)!;
      return {
        id: connectedUserId,
        name: user.name,
        user,
        strength: conn.strength
      };
    })
  ];

  // Create links
  const links: GraphLink[] = userConnections.map(conn => ({
    source: conn.userId1,
    target: conn.userId2,
    strength: conn.strength
  }));

  return { nodes, links };
}

// Distance strategies (pluggable)
export const distanceStrategies: Record<string, DistanceStrategy> = {
  strength: (conn: Connection) => 150 - conn.strength,

  time: (conn: Connection) => {
    const now = new Date();
    const lastInteraction = new Date(conn.lastInteraction);
    const daysSince = Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(200, 50 + daysSince * 2);
  },

  frequency: (conn: Connection) => 200 - Math.min(150, conn.interactionCount)
};

export function calculateLinkDistance(connection: Connection, strategy: 'strength' | 'time' | 'frequency' = 'strength'): number {
  return distanceStrategies[strategy](connection);
}
