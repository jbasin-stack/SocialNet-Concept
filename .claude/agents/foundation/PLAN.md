# Foundation Implementation Plan

## Step-by-Step Instructions

### 1. Initialize Vite + React + TypeScript

```bash
npm create vite@latest . -- --template react-ts
```

This creates:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`

### 2. Install Dependencies

```bash
npm install
npm install react-force-graph-2d
npm install tailwindcss postcss autoprefixer
npm install framer-motion
npm install fuse.js
npm install @types/react-force-graph-2d --save-dev
```

### 3. Configure Tailwind CSS

Initialize Tailwind:
```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Create Type Definitions

**File**: `src/types/index.ts`

```typescript
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
```

### 5. Generate Mock Data

**File**: `src/data/mockData.ts`

```typescript
import { User, Connection } from '../types';

// Current user (center of network)
const currentUser: User = {
  id: 'user-0',
  name: 'You',
  profile: {
    bio: 'Product designer passionate about human-centered design and building meaningful connections through technology.',
    interests: ['Design', 'Photography', 'Hiking'],
    location: 'San Francisco, CA',
    funFact: 'I once hiked the entire Pacific Crest Trail!',
    industry: 'Tech'
  }
};

// Close connections (3-4 users, strength 80-100)
const closeConnections: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    profile: {
      bio: 'Frontend engineer building delightful user experiences. Coffee enthusiast and amateur photographer capturing city life.',
      interests: ['Photography', 'Coffee', 'Web Development'],
      location: 'San Francisco, CA',
      funFact: 'I have visited 30 different coffee roasters in the Bay Area!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-2',
    name: 'Marcus Johnson',
    profile: {
      bio: 'UX researcher uncovering user insights. Love running, cooking, and exploring new restaurants with friends.',
      interests: ['Running', 'Cooking', 'User Research'],
      location: 'Oakland, CA',
      funFact: 'I ran my first marathon last year in under 4 hours!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-3',
    name: 'Emily Rodriguez',
    profile: {
      bio: 'Product manager shipping features that matter. Passionate about music, travel, and building community through technology.',
      interests: ['Music', 'Travel', 'Product Strategy'],
      location: 'San Francisco, CA',
      funFact: 'I play guitar in a local indie band on weekends!',
      industry: 'Tech'
    }
  }
];

// Medium connections (5-6 users, strength 40-79)
const mediumConnections: User[] = [
  {
    id: 'user-4',
    name: 'David Kim',
    profile: {
      bio: 'Data scientist exploring patterns in complex systems. Tennis player and board game enthusiast.',
      interests: ['Data Science', 'Tennis', 'Board Games'],
      location: 'Seattle, WA',
      funFact: 'I own over 50 board games and host game nights monthly!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-5',
    name: 'Lisa Patel',
    profile: {
      bio: 'Healthcare administrator improving patient experiences. Yoga instructor and wellness advocate in my free time.',
      interests: ['Healthcare', 'Yoga', 'Wellness'],
      location: 'Austin, TX',
      funFact: 'I teach free yoga classes at a community center every Sunday!',
      industry: 'Healthcare'
    }
  },
  {
    id: 'user-6',
    name: 'James Wilson',
    profile: {
      bio: 'Software architect designing scalable systems. Love hiking, reading sci-fi, and tinkering with smart home tech.',
      interests: ['Hiking', 'Reading', 'Smart Home'],
      location: 'Denver, CO',
      funFact: 'My home is fully automated - even my coffee brews itself!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-7',
    name: 'Aisha Mohammed',
    profile: {
      bio: 'Financial analyst helping startups grow. Marathon runner and volunteer mentor for aspiring entrepreneurs.',
      interests: ['Finance', 'Running', 'Mentorship'],
      location: 'New York, NY',
      funFact: 'I have completed marathons on all 7 continents!',
      industry: 'Finance'
    }
  },
  {
    id: 'user-8',
    name: 'Carlos Gomez',
    profile: {
      bio: 'Creative director crafting brand stories. Film buff, street photographer, and weekend DJ spinning vinyl.',
      interests: ['Design', 'Film', 'Music'],
      location: 'Los Angeles, CA',
      funFact: 'I collect vintage cameras and have over 20 in my collection!',
      industry: 'Creative'
    }
  }
];

// Distant connections (6-10 users, strength 10-39)
const distantConnections: User[] = [
  {
    id: 'user-9',
    name: 'Nina Petrov',
    profile: {
      bio: 'Teacher inspiring the next generation. Love gardening, painting, and exploring local farmers markets.',
      interests: ['Education', 'Gardening', 'Art'],
      location: 'Portland, OR',
      funFact: 'I grow all my own vegetables in my backyard garden!',
      industry: 'Education'
    }
  },
  {
    id: 'user-10',
    name: 'Ryan O\'Brien',
    profile: {
      bio: 'Sales manager connecting people with solutions. Golfer, wine enthusiast, and aspiring sommelier.',
      interests: ['Golf', 'Wine', 'Networking'],
      location: 'Chicago, IL',
      funFact: 'I have tasted wines from over 15 different countries!',
      industry: 'Retail'
    }
  },
  {
    id: 'user-11',
    name: 'Priya Sharma',
    profile: {
      bio: 'Biotech researcher working on sustainable solutions. Cyclist, baker, and environmental activist.',
      interests: ['Science', 'Cycling', 'Baking'],
      location: 'Boston, MA',
      funFact: 'I bake sourdough bread and share it with my neighbors weekly!',
      industry: 'Healthcare'
    }
  },
  {
    id: 'user-12',
    name: 'Tom Anderson',
    profile: {
      bio: 'Mechanical engineer building the future of transportation. Rock climber and camping enthusiast.',
      interests: ['Engineering', 'Climbing', 'Camping'],
      location: 'Detroit, MI',
      funFact: 'I have climbed every major rock face in Yosemite!',
      industry: 'Manufacturing'
    }
  },
  {
    id: 'user-13',
    name: 'Maya Lee',
    profile: {
      bio: 'Journalist telling stories that matter. Podcast host, avid reader, and language learner studying Mandarin.',
      interests: ['Writing', 'Podcasts', 'Languages'],
      location: 'Washington, DC',
      funFact: 'I speak 4 languages and am learning my fifth!',
      industry: 'Media'
    }
  },
  {
    id: 'user-14',
    name: 'Alex Turner',
    profile: {
      bio: 'Chef creating fusion cuisine experiences. Forager, homebrewer, and culinary adventurer.',
      interests: ['Cooking', 'Brewing', 'Foraging'],
      location: 'Nashville, TN',
      funFact: 'I brew my own beer and have won local competitions!',
      industry: 'Hospitality'
    }
  },
  {
    id: 'user-15',
    name: 'Zoe Martin',
    profile: {
      bio: 'Graphic designer bringing ideas to life. Illustrator, skateboarder, and vintage fashion collector.',
      interests: ['Design', 'Skateboarding', 'Fashion'],
      location: 'Miami, FL',
      funFact: 'I design custom skateboard decks in my spare time!',
      industry: 'Creative'
    }
  },
  {
    id: 'user-16',
    name: 'Hassan Ali',
    profile: {
      bio: 'Architect designing sustainable spaces. Urban explorer, photographer, and history buff.',
      interests: ['Architecture', 'Photography', 'History'],
      location: 'Philadelphia, PA',
      funFact: 'I have photographed over 100 historical buildings in Philly!',
      industry: 'Architecture'
    }
  }
];

export const allUsers: User[] = [
  currentUser,
  ...closeConnections,
  ...mediumConnections,
  ...distantConnections
];

// Connection matrix
export const connections: Connection[] = [
  // Close connections (80-100 strength)
  { userId1: 'user-0', userId2: 'user-1', strength: 95, interactionCount: 47, lastInteraction: new Date('2026-01-28') },
  { userId1: 'user-0', userId2: 'user-2', strength: 88, interactionCount: 38, lastInteraction: new Date('2026-01-30') },
  { userId1: 'user-0', userId2: 'user-3', strength: 92, interactionCount: 42, lastInteraction: new Date('2026-01-29') },

  // Medium connections (40-79 strength)
  { userId1: 'user-0', userId2: 'user-4', strength: 65, interactionCount: 22, lastInteraction: new Date('2026-01-25') },
  { userId1: 'user-0', userId2: 'user-5', strength: 58, interactionCount: 18, lastInteraction: new Date('2026-01-20') },
  { userId1: 'user-0', userId2: 'user-6', strength: 71, interactionCount: 25, lastInteraction: new Date('2026-01-27') },
  { userId1: 'user-0', userId2: 'user-7', strength: 54, interactionCount: 16, lastInteraction: new Date('2026-01-15') },
  { userId1: 'user-0', userId2: 'user-8', strength: 62, interactionCount: 20, lastInteraction: new Date('2026-01-22') },

  // Distant connections (10-39 strength)
  { userId1: 'user-0', userId2: 'user-9', strength: 28, interactionCount: 8, lastInteraction: new Date('2025-12-10') },
  { userId1: 'user-0', userId2: 'user-10', strength: 15, interactionCount: 4, lastInteraction: new Date('2025-11-20') },
  { userId1: 'user-0', userId2: 'user-11', strength: 32, interactionCount: 10, lastInteraction: new Date('2026-01-05') },
  { userId1: 'user-0', userId2: 'user-12', strength: 22, interactionCount: 6, lastInteraction: new Date('2025-12-28') },
  { userId1: 'user-0', userId2: 'user-13', strength: 18, interactionCount: 5, lastInteraction: new Date('2025-11-15') },
  { userId1: 'user-0', userId2: 'user-14', strength: 35, interactionCount: 11, lastInteraction: new Date('2026-01-10') },
  { userId1: 'user-0', userId2: 'user-15', strength: 25, interactionCount: 7, lastInteraction: new Date('2025-12-15') },
  { userId1: 'user-0', userId2: 'user-16', strength: 30, interactionCount: 9, lastInteraction: new Date('2026-01-08') },
];

export const CURRENT_USER_ID = 'user-0';
```

### 6. Create Utility Functions

**File**: `src/utils/graphLayout.ts`

```typescript
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
```

**File**: `src/utils/connectionStrength.ts`

```typescript
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
```

**File**: `src/utils/persistence.ts`

```typescript
import { Connection } from '../types';

const STORAGE_KEY = 'socialnet_graph_state';

export function saveGraphState(connections: Connection[]): void {
  try {
    const serialized = JSON.stringify(connections);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save graph state:', error);
  }
}

export function loadGraphState(): Connection[] | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized);

    // Convert date strings back to Date objects
    return parsed.map((conn: any) => ({
      ...conn,
      lastInteraction: new Date(conn.lastInteraction)
    }));
  } catch (error) {
    console.error('Failed to load graph state:', error);
    return null;
  }
}

export function clearGraphState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear graph state:', error);
  }
}
```

### 7. Update App.tsx

**File**: `src/App.tsx`

```typescript
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center py-8">
        SocialNet POC - Foundation Ready
      </h1>
      <p className="text-center text-gray-600">
        Awaiting Visualization Agent to build NetworkGraph component
      </p>
    </div>
  );
}

export default App;
```

### 8. Verify Setup

Run the development server:
```bash
npm run dev
```

Check:
- [ ] App loads at http://localhost:5173
- [ ] No TypeScript errors
- [ ] Tailwind styles working (text is styled)
- [ ] All imports resolve correctly

## Files Created

```
src/
├── types/
│   └── index.ts (type definitions)
├── data/
│   └── mockData.ts (20 users + connections)
├── utils/
│   ├── graphLayout.ts (graph transformation)
│   ├── connectionStrength.ts (strength calculations)
│   └── persistence.ts (localStorage)
├── App.tsx (minimal placeholder)
└── index.css (Tailwind imports)

Config files:
├── tailwind.config.js
├── postcss.config.js
└── package.json (all dependencies)
```

## Success Criteria

- ✅ Project runs with `npm run dev`
- ✅ TypeScript compiles without errors
- ✅ All 20 users in mockData.ts
- ✅ Connections span 3 strength tiers (close/medium/distant)
- ✅ Utility functions export correctly
- ✅ Tailwind CSS configured and working
- ✅ localStorage functions handle errors gracefully

**Handoff**: Foundation complete! Visualization Agent can now build the NetworkGraph component.
