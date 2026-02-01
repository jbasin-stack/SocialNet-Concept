# Visualization Agent Context

## Your Role
You are the Visualization Agent. Your job is to build the network graph visualization component using react-force-graph-2d. You will create the interactive radial graph where the user is at the center and connections radiate outward based on strength.

## Dependencies
You depend on the **Foundation Agent** having completed:
- Type definitions in `src/types/index.ts`
- Mock data in `src/data/mockData.ts`
- Utility functions in `src/utils/`
- Vite + React + TS project setup

## Scope
- Build NetworkGraph component with react-force-graph-2d
- Implement hybrid radial layout (force simulation + radial constraints)
- Configure link distance based on connection strength
- Add node click handlers
- Implement perspective switching (recenter on clicked user)
- Add zoom/pan controls
- Memoize graph data transformations

## What You Will NOT Do
- Build BusinessCardModal (ui-features agent will do this)
- Build SearchBar or NFCSimulator (ui-features agent)
- Style with Tailwind beyond basic layout (ui-features agent)
- Implement search/filter logic (ui-features agent)

## Technical Approach

### Hybrid Radial Layout
The challenge: force simulations are unpredictable. Solution: use force simulation for initial positioning, then apply radial constraints.

```typescript
// In NetworkGraph component
const graphRef = useRef();

// Force simulation config
<ForceGraph2D
  ref={graphRef}
  graphData={graphData}
  nodeRelSize={6}
  linkDistance={link => 150 - link.strength} // Closer = stronger
  d3Force={{
    charge: { strength: -100 },
    center: { strength: 0.5 }
  }}
  nodeCanvasObject={(node, ctx) => {
    // Apply radial constraints AFTER simulation
    const angle = node.index * (2 * Math.PI / totalNodes);
    const distance = 100 + (100 - (node.strength || 0));
    node.fx = distance * Math.cos(angle); // Fix x position
    node.fy = distance * Math.sin(angle); // Fix y position

    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = node.id === currentUserId ? '#3b82f6' : '#6b7280';
    ctx.fill();
  }}
/>
```

### Perspective Switching
When a node is clicked:
1. Call `onNodeClick` handler with clicked user
2. Rebuild graph data with new center user
3. Animate transition
4. Show "Back to my network" button

### Node Click Handler
```typescript
const handleNodeClick = (node: GraphNode) => {
  // Emit event to parent (App.tsx)
  onNodeClick?.(node.user);

  // Recenter graph
  setCurrentUserId(node.id);
};
```

## Component Structure

```
src/components/NetworkGraph/
├── NetworkGraph.tsx (main component)
└── NetworkGraph.module.css (optional styles)
```

## Props Interface

```typescript
interface NetworkGraphProps {
  currentUserId: string;
  onNodeClick?: (user: User) => void;
  highlightedNodeIds?: string[]; // For search filtering
}
```

## Integration with App.tsx

The Visualization Agent will modify `src/App.tsx` to:
1. Import NetworkGraph
2. Manage graph state (current user, selected node)
3. Pass data and handlers to NetworkGraph

**IMPORTANT**: Coordinate with UI Features Agent - both will modify App.tsx!

## Performance Optimizations

1. **Memoize graph data**: Use `useMemo` to avoid recalculating on every render
2. **Memoize force config**: Avoid recreating functions
3. **Debounce resize events**: If adding responsive behavior
4. **Limit re-renders**: Only update when currentUserId or connections change

## Deliverables Checklist

- [ ] NetworkGraph component created
- [ ] react-force-graph-2d integrated
- [ ] Hybrid radial layout working (force + constraints)
- [ ] Link distance reflects connection strength
- [ ] Node click handler implemented
- [ ] Perspective switching works (recenter on clicked user)
- [ ] Zoom/pan controls available
- [ ] Graph data transformations memoized
- [ ] App.tsx updated to render NetworkGraph
- [ ] Current user highlighted (different color)
- [ ] Graph renders correctly with 20 users

## Testing Checklist

- [ ] Graph renders on page load
- [ ] Current user (user-0) is at center
- [ ] Close connections (high strength) appear closer
- [ ] Distant connections (low strength) appear farther
- [ ] Clicking a node triggers onNodeClick handler
- [ ] Perspective switches to clicked user
- [ ] Zoom in/out works
- [ ] Pan (drag) works
- [ ] No console errors
- [ ] Performance is smooth (no lag)

## Handoff to Next Agent

When complete, the **UI Features Agent** will:
- Add BusinessCardModal that opens when node is clicked
- Add SearchBar that highlights nodes in the graph
- Add NFCSimulator that adds new connections to the graph
- Style everything with Tailwind
- Use context7 MCP for design decisions

Ensure `onNodeClick` prop works correctly so modal can open!
