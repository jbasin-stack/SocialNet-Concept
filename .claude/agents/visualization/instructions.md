# Visualization Agent - Instructions

## Role
Fix NetworkGraph physics, zoom constraints, dimensions, and canvas rendering colors. You handle all graph visualization logic.

## Dependencies
⚠️ **WAIT FOR FOUNDATION AGENT TO COMPLETE FIRST**

You need:
- CSS variables from `index.css` (--graph-center-node, --graph-link, etc.)
- Tailwind config for any utility classes

**Do not start until Foundation Agent confirms completion.**

---

## Files to Modify

### ONLY FILE: `C:\Claude code projects\SocialNet_Concept\src\components\NetworkGraph\NetworkGraph.tsx`

You will make 7 types of changes to this file:

---

## Change 1: Add Header Height Constant

**Location:** Top of file, after imports (around line 5)

**Add:**
```tsx
const HEADER_HEIGHT = 104; // Matches --header-height in index.css
```

---

## Change 2: Update GRAPH_CONSTANTS

**Location:** Lines 7-17 (current constants object)

**Find:**
```tsx
const GRAPH_CONSTANTS = {
  LINK_DISTANCE_MAX: 150,
  CHARGE_STRENGTH: -100,
  CENTER_FORCE_STRENGTH: 0.5,
  BASE_DISTANCE: 100,
  STRENGTH_MULTIPLIER: 1.5,
  CENTER_NODE_SIZE: 8,
  REGULAR_NODE_SIZE: 6,
  COLLISION_RADIUS: 10,
  INITIAL_COOLDOWN: 3000,
  SETTLED_VELOCITY_THRESHOLD: 0.1
};
```

**Replace With:**
```tsx
const GRAPH_CONSTANTS = {
  LINK_DISTANCE_MAX: 150,
  CHARGE_STRENGTH: -120,           // Increased from -100 (more repulsion)
  CENTER_FORCE_STRENGTH: 0.3,      // Reduced from 0.5 (less pull to center)
  BASE_DISTANCE: 100,
  STRENGTH_MULTIPLIER: 1.5,
  CENTER_NODE_SIZE: 8,
  REGULAR_NODE_SIZE: 6,
  COLLISION_RADIUS: 12,            // Increased from 10 (prevent overlap)
  INITIAL_COOLDOWN: 1000,          // Reduced from 3000ms (faster settling)
  SETTLED_VELOCITY_THRESHOLD: 0.05, // Lowered from 0.1 (earlier stop)
  RADIAL_CONSTRAINT_STRENGTH: 0.8  // NEW: strength of radial force
};
```

**Why:** Better physics performance, less jitter.

---

## Change 3: Fix Dimensions Calculation

**Location:** Around lines 57-68

**Find:**
```tsx
const [dimensions, setDimensions] = useState({
  width: typeof window !== 'undefined' ? window.innerWidth : 800,
  height: typeof window !== 'undefined' ? window.innerHeight - 120 : 600
});
```

**Replace With:**
```tsx
const [dimensions, setDimensions] = useState({
  width: typeof window !== 'undefined' ? window.innerWidth : 800,
  height: typeof window !== 'undefined' ? window.innerHeight - HEADER_HEIGHT : 600
});
```

**Also Find (in handleResize):**
```tsx
const handleResize = () => {
  setDimensions({
    width: window.innerWidth,
    height: window.innerHeight - 120
  });
};
```

**Replace With:**
```tsx
const handleResize = () => {
  setDimensions({
    width: window.innerWidth,
    height: window.innerHeight - HEADER_HEIGHT
  });
};
```

**Why:** Use constant instead of magic number 120.

---

## Change 4: Replace Radial Constraint Logic with Continuous Force

**Location:** Around lines 118-156 (the radial constraint useEffect)

**Find the entire useEffect that contains:**
```tsx
const applyRadialConstraints = () => {
  // ... lots of code ...
  d3Node.fx = ...
  d3Node.fy = ...
};

const timer = setTimeout(() => {
  applyRadialConstraints();
  setIsLoading(false);
}, 300);
```

**Replace the ENTIRE useEffect with:**
```tsx
useEffect(() => {
  if (!graphRef.current) return;

  const fg = graphRef.current;

  // Configure standard D3 forces
  const linkForce = fg.d3Force('link');
  const chargeForce = fg.d3Force('charge');
  const centerForce = fg.d3Force('center');

  if (linkForce) {
    linkForce.distance((link: D3LinkObject) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;

      const originalLink = graphData.links.find(l =>
        (l.source === sourceId && l.target === targetId) ||
        (l.source === targetId && l.target === sourceId)
      );

      return originalLink ? GRAPH_CONSTANTS.LINK_DISTANCE_MAX - originalLink.strength : 100;
    });
  }

  if (chargeForce) {
    chargeForce.strength(GRAPH_CONSTANTS.CHARGE_STRENGTH);
  }

  if (centerForce) {
    centerForce.strength(GRAPH_CONSTANTS.CENTER_FORCE_STRENGTH);
  }

  // Add collision force
  fg.d3Force('collide', (window as any).d3?.forceCollide?.(GRAPH_CONSTANTS.COLLISION_RADIUS));

  // Custom radial force (runs every tick, not just once)
  fg.d3Force('radial', () => {
    const nodes = fg.graphData().nodes as D3NodeObject[];
    const connectedNodes = nodes.filter((n: D3NodeObject) => n.id !== currentUserId);

    nodes.forEach((node: D3NodeObject) => {
      if (node.id === currentUserId) {
        // Center node: pull towards origin with damping
        node.vx = (node.vx || 0) * 0.5 - (node.x || 0) * 0.1;
        node.vy = (node.vy || 0) * 0.5 - (node.y || 0) * 0.1;
      } else {
        // Connected nodes: pull towards ideal radial position
        const nodeIndex = connectedNodes.findIndex((n: D3NodeObject) => n.id === node.id);
        const originalNode = graphData.nodes.find(n => n.id === node.id);

        if (nodeIndex !== -1 && originalNode?.strength !== undefined) {
          const angle = (nodeIndex / connectedNodes.length) * 2 * Math.PI;
          const targetDistance = GRAPH_CONSTANTS.BASE_DISTANCE +
                                (100 - originalNode.strength) * GRAPH_CONSTANTS.STRENGTH_MULTIPLIER;

          const targetX = targetDistance * Math.cos(angle);
          const targetY = targetDistance * Math.sin(angle);

          // Apply velocity towards target position
          const dx = targetX - (node.x || 0);
          const dy = targetY - (node.y || 0);
          const strength = GRAPH_CONSTANTS.RADIAL_CONSTRAINT_STRENGTH;

          node.vx = (node.vx || 0) + dx * strength * 0.1;
          node.vy = (node.vy || 0) + dy * strength * 0.1;
        }
      }
    });
  });

  // Stop loading after initial layout
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 300);

  return () => clearTimeout(timer);
}, [graphData, currentUserId]);
```

**Why:** Continuous force instead of one-time fixed positions. Eliminates jitter and oscillation.

---

## Change 5: Update Canvas Rendering Colors

**Find these lines and update:**

**Line ~207 (link color):**
```tsx
// OLD
ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;

// NEW
ctx.strokeStyle = `rgba(var(--graph-link), ${opacity})`;
```

**Lines ~224-229 (node colors):**
```tsx
// OLD
let nodeColor = '#6b7280';
if (node.id === currentUserId) {
  nodeColor = '#3b82f6';
} else if (isHighlighted) {
  nodeColor = '#10b981';
}

// NEW
let nodeColor = `rgb(var(--graph-regular-node))`;
if (node.id === currentUserId) {
  nodeColor = `rgb(var(--graph-center-node))`;
} else if (isHighlighted) {
  nodeColor = `rgb(var(--graph-highlight-node))`;
}
```

**Line ~251 (label color):**
```tsx
// OLD
ctx.fillStyle = '#1f2937';

// NEW
ctx.fillStyle = 'rgb(var(--graph-regular-node))';
```

**Line ~306 (background color in ForceGraph2D props):**
```tsx
// OLD
backgroundColor="#f9fafb"

// NEW
backgroundColor="rgb(var(--graph-background))"
```

**Why:** Use CSS variables from design system for consistent colors.

---

## Change 6: Update Physics Props

**Location:** Around lines 300-302 (ForceGraph2D component props)

**Find:**
```tsx
d3VelocityDecay={0.3}
d3AlphaDecay={0.02}
cooldownTime={GRAPH_CONSTANTS.INITIAL_COOLDOWN}
```

**Replace With:**
```tsx
d3VelocityDecay={0.4}
d3AlphaDecay={0.0228}
cooldownTime={GRAPH_CONSTANTS.INITIAL_COOLDOWN}
```

**Why:** D3 default values, better performance (nodes decelerate faster, simulation settles quicker).

---

## Change 7: Add Zoom Constraints

**Location:** After line ~305 (after `enablePanInteraction={true}`)

**Add these two props:**
```tsx
minZoom={0.5}
maxZoom={4}
```

**Why:** Prevents zooming infinitely in/out. Reasonable bounds for graph visibility.

---

## Verification Checklist

After making all changes:

1. ✅ HEADER_HEIGHT constant defined at top
2. ✅ GRAPH_CONSTANTS updated with new values
3. ✅ Dimensions use HEADER_HEIGHT (not 120)
4. ✅ Radial constraint replaced with continuous force (useEffect should call `fg.d3Force('radial', ...)`)
5. ✅ All canvas colors use CSS variables (rgb(var(--graph-...)))
6. ✅ d3VelocityDecay is 0.4, d3AlphaDecay is 0.0228
7. ✅ minZoom={0.5} and maxZoom={4} props added to ForceGraph2D
8. ✅ File compiles without TypeScript errors
9. ✅ Graph renders and settles within 1-2 seconds (not 3+)
10. ✅ No jittering or oscillation after settling
11. ✅ Zoom in/out has limits (can't zoom infinitely)

## Testing

1. Run `npm run dev`
2. Open browser
3. Graph should settle smoothly in ~1-2 seconds
4. Try zooming - should stop at 0.5x and 4x
5. Nodes should not jitter after settling
6. Graph colors should match design system (blue center, gray nodes)

## Estimated Time
30-40 minutes

## Can Work in Parallel With
**UI Features Agent** - They don't touch NetworkGraph.tsx

## Handoff Signal
When done, confirm: "Visualization Agent Complete - NetworkGraph optimized"
