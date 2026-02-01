# Social Network POC - Implementation Plan

## Concept
Gamified social network based on REAL physical interactions (NFC taps). Radial tree visualization: you at center, connections branch out by interaction strength/frequency.

## Tech Stack
- **React + TypeScript + Vite** (fast dev, modern)
- **react-force-graph-2d** (automatic node positioning via D3 force simulation)
- **Tailwind CSS** (rapid styling)
- **Framer Motion** (modal animations)
- **Fuse.js** (fuzzy search)

## Core Components

1. **NetworkGraph** - Force-directed graph, user at center, link distance = connection strength
2. **BusinessCardModal** - Profile popup (name + 150 words: bio, interests, location, fun fact)
3. **SearchBar** - Filter by location/interests/industry, highlight matches
4. **NFCSimulator** - Button to mock phone tap, adds new connection with animation

## Data Structure

```typescript
User: { id, name, profile: { bio, interests[], location, funFact, industry } }
Connection: { userId1, userId2, strength: 0-100, interactionCount }
```

Mock 15-20 users: 3-4 close (strength 80-100), 5-6 medium (40-79), 6-10 distant (10-39)

## Solutions to Potential Issues

### 1. Force Simulation Unpredictability
**Solution**: Use hybrid approach - force simulation for initial positioning, then apply radial constraints
```typescript
// Constrain nodes to radial positions after force simulation
nodeCanvasObject={(node, ctx) => {
  const angle = node.index * (2 * Math.PI / totalNodes);
  const distance = 100 + (100 - node.strength); // 100-200px from center
  node.fx = distance * Math.cos(angle); // Fix x position
  node.fy = distance * Math.sin(angle); // Fix y position
}}
```

### 2. Distance Meaning
**Solution**: Make distance calculation pluggable - create a `distanceStrategy` function
```typescript
const distanceStrategies = {
  strength: (conn) => 150 - conn.strength,
  time: (conn) => daysSince(conn.lastInteraction),
  frequency: (conn) => 200 - conn.interactionCount
};
```

### 3. Perspective Switching Performance
**Solution**: Limit to 1 degree of connections only (direct connections). Pre-calculate and memoize all user subgraphs.

### 4. 150-Word Limit Enforcement
**Solution**: Add real-time word counter to profile fields with visual feedback (green < 130, yellow 130-150, red > 150)

### 5. Persistence
**Solution**: Use localStorage to save graph state. Auto-save on changes.

## Three-Subproject Breakdown

### Subproject A: Foundation & Data
**Location**: `.claude/agents/foundation/`
**Scope**: Project setup, data models, mock data generation
**Deliverables**:
- Vite + React + TS project initialized
- All dependencies installed
- Type definitions (User, Connection, GraphData)
- Mock data: 20 users with diverse attributes, connection matrix
- Utility functions: graphLayout.ts, connectionStrength.ts
- localStorage persistence layer

### Subproject B: Visualization & Graph
**Location**: `.claude/agents/visualization/`
**Scope**: Network graph component, force simulation, interactions
**Deliverables**:
- NetworkGraph component with react-force-graph-2d
- Radial constraint system (hybrid force + fixed positions)
- Node click handlers
- Perspective switching (recenter on clicked user)
- Zoom/pan controls
- Graph data transformations

### Subproject C: UI & Features
**Location**: `.claude/agents/ui-features/`
**Scope**: Business cards, search, NFC, styling
**Deliverables**:
- BusinessCardModal with Framer Motion animations
- SearchBar with Fuse.js integration
- Filter highlighting (color/size node changes)
- NFCSimulator component (button + animation)
- Word counter for profile fields
- Responsive layout with Tailwind
- Design system using **context7 MCP for design assets/guidance**

## Agent Coordination

### Execution Order
1. **Foundation Agent** → Complete setup, types, mock data
2. **Visualization Agent** → Build graph (depends on #1)
3. **UI Features Agent** → Add features (depends on #2)

### Handoff Points
- Foundation → Visualization: Mock data format validated, types exported
- Visualization → UI: Graph component working with click handlers
- UI → Final: All features implemented, ready for testing

### Shared Dependencies
- All agents use same package.json
- All import from shared types (src/types/)
- Visualization + UI both modify App.tsx (coordinate!)

## Success Criteria

POC demonstrates:
1. Radial graph with strength-based positioning ✓
2. Click node → business card → view their network ✓
3. Search/filter highlighting ✓
4. NFC tap simulation ✓
5. 150-word profile enforcement ✓
6. localStorage persistence ✓
7. Mobile responsive ✓
8. Clean, professional design (context7) ✓
