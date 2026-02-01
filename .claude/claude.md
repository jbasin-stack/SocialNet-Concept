# SocialNet Concept - POC Overview

## Project Vision
Gamified social network based on REAL physical interactions (NFC taps). Features a radial tree visualization where you are at the center and connections branch out based on interaction strength and frequency.

## Architecture

### Core Concept
- **User at Center**: The logged-in user is always at the graph's center
- **Radial Layout**: Connections radiate outward with distance representing relationship strength
- **Strength-Based Positioning**: Closer connections (high strength 80-100) appear nearer, distant connections (10-39) appear farther
- **Perspective Switching**: Click any node to recenter the graph from their perspective

### Tech Stack
- **React + TypeScript + Vite**: Modern, fast development
- **react-force-graph-2d**: Automatic node positioning via D3 force simulation
- **Tailwind CSS**: Rapid styling with utility classes
- **Framer Motion**: Smooth modal animations
- **Fuse.js**: Fuzzy search for filtering connections

### Data Models

```typescript
User {
  id: string
  name: string
  profile: {
    bio: string          // Max 150 words
    interests: string[]
    location: string
    funFact: string
    industry: string
  }
}

Connection {
  userId1: string
  userId2: string
  strength: number      // 0-100
  interactionCount: number
  lastInteraction: Date
}
```

### Component Relationships

```
App
├── NetworkGraph (visualization agent)
│   ├── Force simulation
│   ├── Radial constraints
│   └── Click handlers
├── BusinessCardModal (ui-features agent)
│   ├── Profile display
│   └── "View their network" button
├── SearchBar (ui-features agent)
│   ├── Fuse.js filtering
│   └── Node highlighting
└── NFCSimulator (ui-features agent)
    ├── Tap animation
    └── Add connection logic
```

### File Structure

```
src/
├── components/
│   ├── NetworkGraph/
│   │   └── NetworkGraph.tsx
│   ├── BusinessCardModal/
│   │   └── BusinessCardModal.tsx
│   ├── SearchBar/
│   │   └── SearchBar.tsx
│   └── NFCSimulator/
│       └── NFCSimulator.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── utils/
│   ├── graphLayout.ts
│   ├── connectionStrength.ts
│   └── persistence.ts
├── hooks/
│   └── useNetworkData.ts
└── App.tsx
```

## Key Features

1. **Radial Graph Visualization**: Force-directed layout with strength-based positioning
2. **Business Card Modal**: 150-word profile popup on node click
3. **Search & Filter**: Highlight nodes by location/interests/industry
4. **NFC Simulation**: Mock phone tap to add new connections
5. **Perspective Switching**: Recenter graph to view any user's network
6. **LocalStorage Persistence**: Auto-save graph state

## Design System (via context7 MCP)

All agents must use context7 MCP for design decisions:
- Color palette (primary, secondary, accent, neutral)
- Typography scale and font families
- Spacing/sizing system (4px/8px grid)
- Animation curves and durations
- Component styling patterns
- Responsive breakpoints
- Accessibility (color contrast, ARIA labels)
