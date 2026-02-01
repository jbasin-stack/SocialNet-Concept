# Foundation Agent Context

## Your Role
You are the Foundation Agent. Your job is to set up the project foundation and data layer for the SocialNet POC. You will NOT build the visualization or UI components - other agents will handle that.

## Scope
- Initialize Vite + React + TypeScript project
- Install all dependencies
- Create type definitions
- Generate mock data (20 users with varied attributes)
- Build utility functions for graph layout and connection strength
- Implement localStorage persistence layer

## What You Will NOT Do
- Build NetworkGraph component (visualization agent)
- Build BusinessCardModal, SearchBar, or NFCSimulator (ui-features agent)
- Style components with Tailwind (ui-features agent)
- Implement animations (ui-features agent)

## Dependencies to Install

```bash
npm create vite@latest . -- --template react-ts
npm install react-force-graph-2d
npm install tailwindcss postcss autoprefixer
npm install framer-motion
npm install fuse.js
npm install @types/react-force-graph-2d --save-dev
```

## Type Definitions to Create

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
  strength?: number; // For positioning
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
```

## Mock Data Requirements

**File**: `src/data/mockData.ts`

Create 20 users with:
- **3-4 close connections** (strength 80-100)
- **5-6 medium connections** (strength 40-79)
- **6-10 distant connections** (strength 10-39)

Diverse attributes:
- **Industries**: Tech, Healthcare, Education, Finance, Creative, Retail, etc.
- **Locations**: Various cities (San Francisco, New York, Austin, Seattle, etc.)
- **Interests**: Photography, Hiking, Cooking, Gaming, Music, Reading, etc.

The "current user" (ID: "user-0") should be the center of the network.

## Utility Functions

### graphLayout.ts
**File**: `src/utils/graphLayout.ts`

```typescript
// Transform users + connections into graph format
export function buildGraphData(
  currentUserId: string,
  users: User[],
  connections: Connection[]
): GraphData {
  // Filter connections for current user
  // Map to nodes and links
  // Calculate strength for each node
}

// Distance strategy (pluggable)
export const distanceStrategies = {
  strength: (conn: Connection) => 150 - conn.strength,
  time: (conn: Connection) => {
    const days = daysSinceInteraction(conn.lastInteraction);
    return Math.min(200, 50 + days * 2);
  },
  frequency: (conn: Connection) => 200 - Math.min(150, conn.interactionCount)
};
```

### connectionStrength.ts
**File**: `src/utils/connectionStrength.ts`

```typescript
// Calculate connection strength between two users
export function calculateStrength(
  interactionCount: number,
  daysSinceLastInteraction: number
): number {
  // Formula: base on frequency, decay over time
  // Return 0-100
}

// Get connection between two users
export function getConnection(
  userId1: string,
  userId2: string,
  connections: Connection[]
): Connection | null {
  // Find connection (bidirectional)
}
```

### persistence.ts
**File**: `src/utils/persistence.ts`

```typescript
const STORAGE_KEY = 'socialnet_graph_state';

export function saveGraphState(connections: Connection[]): void {
  // Save to localStorage
  // Handle errors gracefully
}

export function loadGraphState(): Connection[] | null {
  // Load from localStorage
  // Return null if not found or corrupted
}

export function clearGraphState(): void {
  // Clear localStorage
}
```

## Tailwind Configuration

**File**: `tailwind.config.js`

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

**File**: `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**File**: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Deliverables Checklist

- [ ] Vite + React + TS project initialized
- [ ] All dependencies installed (check package.json)
- [ ] Type definitions created (`src/types/index.ts`)
- [ ] Mock data generated (`src/data/mockData.ts`) with 20 users
- [ ] graphLayout.ts utility created
- [ ] connectionStrength.ts utility created
- [ ] persistence.ts utility created
- [ ] Tailwind configured (config files + index.css)
- [ ] Basic App.tsx exists (can be minimal, just "SocialNet POC")
- [ ] Project runs with `npm run dev`

## Handoff to Next Agent

When complete, the **Visualization Agent** will:
- Import types from `src/types/index.ts`
- Import mock data from `src/data/mockData.ts`
- Use utility functions from `src/utils/`
- Build NetworkGraph component

Ensure all exports are correct and types are accurate!
