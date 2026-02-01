export interface UserProfile {
  bio: string;
  interests: string[];
  location: string;
  funFact: string;
  industry: string;
}

export interface User {
  id: string;
  name: string;
  profile: UserProfile;
}

export interface Connection {
  userId1: string;
  userId2: string;
  strength: number; // 0-100
  interactionCount: number;
  lastInteraction: Date;
}

export interface GraphNode {
  id: string;
  name: string;
  user: User;
  strength?: number; // For radial positioning
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface DistanceStrategy {
  (connection: Connection): number;
}
