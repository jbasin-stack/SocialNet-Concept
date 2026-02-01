import { Connection } from '../types';

const STORAGE_KEY = 'socialnet_graph_state';

interface SerializedConnection {
  userId1: string;
  userId2: string;
  strength: number;
  interactionCount: number;
  lastInteraction: string; // Date serialized as ISO string
}

export function saveGraphState(connections: Connection[]): void {
  try {
    const serialized = JSON.stringify(connections);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Silent fail - localStorage quota exceeded or unavailable
    // TODO: Implement proper logging service in production
  }
}

export function loadGraphState(): Connection[] | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized) as SerializedConnection[];

    // Convert date strings back to Date objects
    return parsed.map((conn) => ({
      ...conn,
      lastInteraction: new Date(conn.lastInteraction)
    }));
  } catch (error) {
    // Silent fail - corrupted data or localStorage unavailable
    // Fallback to default mock data
    return null;
  }
}

export function clearGraphState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Silent fail - localStorage unavailable
  }
}
