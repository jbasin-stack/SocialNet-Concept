# Visualization Implementation Plan

## Step-by-Step Instructions

### 1. Create NetworkGraph Component Structure

**File**: `src/components/NetworkGraph/NetworkGraph.tsx`

```typescript
import { useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { User, GraphData, GraphNode } from '../../types';
import { buildGraphData } from '../../utils/graphLayout';
import { allUsers, connections } from '../../data/mockData';

interface NetworkGraphProps {
  currentUserId: string;
  onNodeClick?: (user: User) => void;
  highlightedNodeIds?: string[];
}

export default function NetworkGraph({
  currentUserId,
  onNodeClick,
  highlightedNodeIds = []
}: NetworkGraphProps) {
  const graphRef = useRef<any>();

  // Memoize graph data to avoid recalculation
  const graphData = useMemo(() => {
    return buildGraphData(currentUserId, allUsers, connections);
  }, [currentUserId]);

  // Node click handler
  const handleNodeClick = useCallback((node: any) => {
    const graphNode = node as GraphNode;
    if (onNodeClick) {
      onNodeClick(graphNode.user);
    }
  }, [onNodeClick]);

  // Custom node rendering with radial constraints
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const graphNode = node as GraphNode;
    const isCurrentUser = graphNode.id === currentUserId;
    const isHighlighted = highlightedNodeIds.includes(graphNode.id);

    // Node size
    const nodeSize = isCurrentUser ? 8 : 5;

    // Node color
    let color = '#6b7280'; // gray
    if (isCurrentUser) color = '#3b82f6'; // blue
    else if (isHighlighted) color = '#10b981'; // green

    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw label
    ctx.font = `${12 / globalScale}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(graphNode.name, node.x, node.y + nodeSize + 10 / globalScale);
  }, [currentUserId, highlightedNodeIds]);

  // Link distance based on strength
  const linkDistance = useCallback((link: any) => {
    return 150 - link.strength;
  }, []);

  return (
    <div className="w-full h-screen">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeRelSize={6}
        linkDistance={linkDistance}
        linkColor={() => '#d1d5db'}
        linkWidth={1}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={nodeCanvasObject}
        enableNodeDrag={false}
        enableZoomPanInteraction={true}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        onEngineStop={() => console.log('Force simulation complete')}
      />
    </div>
  );
}
```

### 2. Update App.tsx to Use NetworkGraph

**File**: `src/App.tsx`

```typescript
import { useState } from 'react';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import { User } from './types';
import { CURRENT_USER_ID } from './data/mockData';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleNodeClick = (user: User) => {
    setSelectedUser(user);
    console.log('Node clicked:', user.name);
    // TODO: UI Features Agent will open BusinessCardModal here
  };

  const handleViewNetwork = (userId: string) => {
    setCurrentUserId(userId);
    setSelectedUser(null);
  };

  const handleBackToMyNetwork = () => {
    setCurrentUserId(CURRENT_USER_ID);
    setSelectedUser(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">SocialNet POC</h1>
          {currentUserId !== CURRENT_USER_ID && (
            <button
              onClick={handleBackToMyNetwork}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ← Back to My Network
            </button>
          )}
        </div>
      </div>

      {/* Network Graph */}
      <div className="pt-20">
        <NetworkGraph
          currentUserId={currentUserId}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* Placeholder for BusinessCardModal */}
      {selectedUser && (
        <div className="absolute bottom-4 right-4 p-4 bg-white shadow-lg rounded">
          <p className="font-bold">{selectedUser.name}</p>
          <p className="text-sm text-gray-600">{selectedUser.profile.location}</p>
          <button
            onClick={() => handleViewNetwork(selectedUser.id)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            View their network
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-2 ml-2 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
```

### 3. Advanced: Radial Constraints (Optional Enhancement)

If force simulation positioning is too chaotic, add radial constraints:

```typescript
// In NetworkGraph.tsx, add this effect after force simulation settles
useEffect(() => {
  if (!graphRef.current) return;

  const graph = graphRef.current;

  // Wait for simulation to settle
  setTimeout(() => {
    graphData.nodes.forEach((node, index) => {
      const totalNodes = graphData.nodes.length - 1; // Exclude center

      if (node.id === currentUserId) {
        // Fix center node at origin
        node.fx = 0;
        node.fy = 0;
      } else {
        // Calculate radial position
        const angle = (index / totalNodes) * 2 * Math.PI;
        const distance = 100 + (100 - (node.strength || 0));

        // Apply constraints
        node.fx = distance * Math.cos(angle);
        node.fy = distance * Math.sin(angle);
      }
    });

    // Reheat simulation to apply constraints
    graph.d3ReheatSimulation();
  }, 2000);
}, [graphData, currentUserId]);
```

### 4. Add Perspective Switching Logic

Already handled in App.tsx above:
- `handleNodeClick`: Captures clicked user
- `handleViewNetwork`: Recenters graph on clicked user
- `handleBackToMyNetwork`: Returns to original user

### 5. Optimization: Memoize Everything

```typescript
// In NetworkGraph.tsx
const graphData = useMemo(() => {
  return buildGraphData(currentUserId, allUsers, connections);
}, [currentUserId]);

const linkDistance = useCallback((link: any) => {
  return 150 - link.strength;
}, []);

const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
  // ... rendering logic
}, [currentUserId, highlightedNodeIds]);
```

### 6. Test the Graph

Run the dev server:
```bash
npm run dev
```

Check:
- [ ] Graph renders with 20 nodes
- [ ] Current user (user-0) is highlighted blue
- [ ] Other nodes are gray
- [ ] Links connect current user to others
- [ ] Closer connections appear nearer (high strength)
- [ ] Clicking a node logs to console and shows placeholder modal
- [ ] "View their network" button recenters graph
- [ ] "Back to My Network" button returns to user-0
- [ ] Zoom in/out works (scroll wheel)
- [ ] Pan works (drag background)

### 7. Edge Cases to Handle

1. **No Connections**: If a user has no connections, show just their node
2. **Self-Loop**: Ensure userId1 ≠ userId2 in connections
3. **Duplicate Connections**: Filter out duplicates in buildGraphData
4. **Missing Users**: Validate all connection userIds exist in users array

### 8. Performance Check

With 20 nodes, performance should be excellent. If adding more:
- Use `cooldownTicks` to limit simulation iterations
- Use `d3AlphaDecay` to speed up simulation settling
- Consider `enableNodeDrag={false}` to prevent accidental drags

## Files Created/Modified

```
src/
├── components/
│   └── NetworkGraph/
│       └── NetworkGraph.tsx (NEW)
└── App.tsx (MODIFIED)
```

## Success Criteria

- ✅ NetworkGraph component renders
- ✅ Force simulation positions nodes
- ✅ Link distance reflects strength (150 - strength)
- ✅ Current user highlighted blue at center
- ✅ Node click handler works
- ✅ Perspective switching works (recenter on click)
- ✅ "Back to My Network" button works
- ✅ Zoom/pan controls functional
- ✅ No console errors
- ✅ Performance is smooth

**Handoff**: Visualization complete! UI Features Agent can now:
- Replace placeholder modal with BusinessCardModal
- Add SearchBar to filter/highlight nodes
- Add NFCSimulator to add new connections
- Apply proper Tailwind styling
- Use context7 MCP for design
