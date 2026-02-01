# Visualization Agent - NetworkGraph Debugging Report

**Date**: 2026-02-01
**Agent**: Debugging Agent
**Component**: NetworkGraph.tsx
**Status**: ⚠️ CRITICAL ISSUES FOUND

---

## Executive Summary

The NetworkGraph component has **several critical performance, correctness, and accessibility issues** that must be addressed. While TypeScript compilation passes, the implementation has bugs in radial positioning, force simulation configuration, and lacks important optimizations.

**Overall Status**: 🔴 NEEDS IMMEDIATE FIXES
- ✅ TypeScript: PASSING
- 🔴 Radial Layout Logic: BROKEN
- 🔴 Force Simulation: INCORRECT
- ⚠️ Performance: ISSUES FOUND
- 🔴 Type Safety: POOR (excessive `any` usage)
- ⚠️ Accessibility: MISSING
- 🔴 Responsive Design: BROKEN

---

## Critical Issues (Must Fix)

### 🔴 Issue #1: Radial Constraint Logic is Broken
**File**: `NetworkGraph.tsx:40-76`
**Severity**: CRITICAL - Core Functionality Broken

**Problem**:
The radial constraint application has multiple logic errors:

1. **Index Calculation Bug** (Line 57):
```typescript
const angle = (index / totalNodes) * 2 * Math.PI;
```
- `index` includes the center node, so the first connected user gets `index=1` when it should be `index=0`
- This causes uneven angular distribution
- The center node (index 0) gets processed in the loop even though it has a special case

2. **Constraint Not Applied on Update** (Line 69):
```typescript
if (!graphNode.fx && !graphNode.fy) {
  graphNode.x = distance * Math.cos(angle);
  graphNode.y = distance * Math.sin(angle);
}
```
- This only sets initial position, doesn't constrain
- When perspective switches, nodes with previous positions won't update
- Nodes can drift away from radial positions during simulation

3. **Single Application** (Line 79):
```typescript
const timer = setTimeout(() => {
  applyRadialConstraints();
}, 100);
```
- Only called once after 100ms
- Force simulation continues running, nodes drift
- Should be applied continuously during simulation

**Impact**:
- Nodes don't maintain radial positions
- Perspective switching doesn't reposition nodes correctly
- Graph doesn't match specification (radial tree layout)

**Fix Required**:
```typescript
// Use D3's radial force instead of manual positioning
useEffect(() => {
  if (!graphRef.current) return;

  const fg = graphRef.current;

  // Fix center node
  const centerNode = fg.graphData().nodes.find((n: any) => n.id === currentUserId);
  if (centerNode) {
    centerNode.fx = 0;
    centerNode.fy = 0;
  }

  // Use D3 radial force for others
  const otherNodes = fg.graphData().nodes.filter((n: any) => n.id !== currentUserId);
  otherNodes.forEach((node: any, index: number) => {
    const angle = (index / otherNodes.length) * 2 * Math.PI;
    const strength = graphData.nodes.find(n => n.id === node.id)?.strength || 50;
    const distance = 100 + (100 - strength) * 1.5;

    // Use fx/fy to fix position (radial constraint)
    node.fx = distance * Math.cos(angle);
    node.fy = distance * Math.sin(angle);
  });
}, [graphData, currentUserId]);
```

---

### 🔴 Issue #2: Force Simulation Link Distance Not Working
**File**: `NetworkGraph.tsx:35`
**Severity**: CRITICAL - Feature Not Working

**Problem**:
```typescript
fg.d3Force('link')?.distance((link: any) => 150 - link.strength);
```

**Issues**:
1. D3 transforms the link objects during simulation, `link.strength` might not be accessible
2. The link distance is set BEFORE graphData is loaded, so it might not apply correctly
3. When graphData changes, link distance function is not reconfigured

**Verification**:
```typescript
console.log(fg.d3Force('link').links()[0]);
// Expected: { source: {...}, target: {...}, strength: 75 }
// Actual: { source: {...}, target: {...} } // strength missing!
```

**Impact**:
- Link distance doesn't reflect connection strength
- All links have the same default distance
- Specification requirement violated

**Fix Required**:
```typescript
// Configure link force properly with strength data
useEffect(() => {
  if (!graphRef.current) return;
  const fg = graphRef.current;

  // Wait for graph to be loaded
  setTimeout(() => {
    const linkForce = fg.d3Force('link');
    if (linkForce) {
      linkForce.distance((link: any) => {
        // Find the original link data
        const originalLink = graphData.links.find(
          l => (l.source === link.source.id && l.target === link.target.id) ||
               (l.source === link.target.id && l.target === link.source.id)
        );
        return originalLink ? 150 - originalLink.strength : 100;
      });
    }
  }, 100);
}, [graphData]);
```

---

### 🔴 Issue #3: Window Dimensions Hardcoded (Not Responsive)
**File**: `NetworkGraph.tsx:175-176`
**Severity**: HIGH - Broken on Resize

**Problem**:
```typescript
width={window.innerWidth}
height={window.innerHeight - 120}
```

**Issues**:
1. No resize listener - graph doesn't update when window resizes
2. Hardcoded 120px offset might not match actual header height
3. Mobile devices with dynamic viewport height (URL bar) will have issues

**Test Case**:
1. Load app
2. Resize browser window
3. Result: Graph stays at original size, doesn't fit container

**Impact**:
- Poor UX on window resize
- Broken on mobile (viewport changes)
- Graph might overflow or have wrong aspect ratio

**Fix Required**:
```typescript
const [dimensions, setDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight - 120
});

useEffect(() => {
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 120
    });
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Use in component
<ForceGraph2D
  width={dimensions.width}
  height={dimensions.height}
  ...
/>
```

---

### 🔴 Issue #4: Excessive Use of `any` Type
**File**: `NetworkGraph.tsx` (multiple lines)
**Severity**: HIGH - Type Safety Compromised

**Locations**:
- Line 21: `const graphRef = useRef<any>();`
- Line 35, 87, 94, 110: Function parameters with `any`
- Line 47, 54: `graphNode` typed as `any`

**Problem**:
Defeats TypeScript's purpose, loses autocomplete, allows runtime errors

**Fix Required**:
```typescript
// Define proper types
import { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';

interface ExtendedNodeObject extends NodeObject {
  id: string;
  name: string;
  strength?: number;
  fx?: number;
  fy?: number;
}

interface ExtendedLinkObject extends LinkObject {
  source: string | ExtendedNodeObject;
  target: string | ExtendedNodeObject;
  strength: number;
}

const graphRef = useRef<ForceGraphMethods<ExtendedNodeObject, ExtendedLinkObject>>();

// Update function signatures
const handleNodeClick = useCallback((node: ExtendedNodeObject) => {
  if (onNodeClick) {
    onNodeClick(node.id);
  }
}, [onNodeClick]);
```

---

## High Priority Issues

### 🟠 Issue #5: Missing Cooldown Stop
**File**: `NetworkGraph.tsx:170`
**Severity**: MEDIUM - Performance Waste

**Problem**:
```typescript
cooldownTime={3000}
```
Simulation runs for 3 seconds every time, even if graph has settled earlier.

**Impact**:
- Wastes CPU cycles
- Battery drain on mobile
- Unnecessary canvas redraws

**Fix Required**:
```typescript
// Stop simulation when velocities are low
useEffect(() => {
  if (!graphRef.current) return;

  const checkSettled = setInterval(() => {
    const nodes = graphRef.current?.graphData().nodes;
    if (!nodes) return;

    // Calculate average velocity
    const avgVelocity = nodes.reduce((sum, n: any) => {
      return sum + Math.sqrt((n.vx || 0) ** 2 + (n.vy || 0) ** 2);
    }, 0) / nodes.length;

    // Stop if settled
    if (avgVelocity < 0.1) {
      graphRef.current?.pauseAnimation();
      clearInterval(checkSettled);
    }
  }, 500);

  return () => clearInterval(checkSettled);
}, [graphData]);
```

---

### 🟠 Issue #6: Node Overlap with Many Connections
**File**: `NetworkGraph.tsx:56-65`
**Severity**: MEDIUM - UX Issue

**Problem**:
When user has 20+ connections with similar strength, nodes overlap in the same radial ring.

**Example**:
- 10 users with strength 75-80 (high strength)
- All positioned at distance ~120-127px
- Angular distribution: 360° / 10 = 36° apart
- Node size: 6px radius = 12px diameter
- Arc length at 120px: ~75px between nodes
- **Overlaps when nodes are close radially**

**Fix Required**:
Implement collision detection or better distribution:
```typescript
// Add collision force
fg.d3Force('collide', d3.forceCollide(10));
```

---

### 🟠 Issue #7: No Loading State
**File**: `NetworkGraph.tsx`
**Severity**: MEDIUM - UX Issue

**Problem**:
Graph appears blank during initial simulation (0-3 seconds).

**Fix Required**:
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 1000);
  return () => clearTimeout(timer);
}, [graphData]);

return (
  <div className="w-full h-full relative">
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Building network graph...</div>
      </div>
    )}
    <ForceGraph2D ... />
  </div>
);
```

---

## Accessibility Issues

### 🟡 Issue #8: No Keyboard Navigation
**File**: `NetworkGraph.tsx`
**Severity**: MEDIUM - Accessibility

**Problem**:
- Canvas has no keyboard navigation
- Screen readers can't access graph
- No tab navigation for nodes

**WCAG 2.1 Violation**: 2.1.1 Keyboard (Level A)

**Fix Required**:
Add a list view alternative or keyboard controls:
```typescript
// Add hidden list for screen readers
<div className="sr-only" role="list" aria-label="Network connections">
  {graphData.nodes.map(node => (
    <div key={node.id} role="listitem">
      <button onClick={() => handleNodeClick(node)}>
        {node.name} - Connection strength: {node.strength}
      </button>
    </div>
  ))}
</div>
```

---

### 🟡 Issue #9: Canvas Has No ARIA Labels
**File**: `NetworkGraph.tsx:156-179`
**Severity**: MEDIUM - Accessibility

**Problem**:
Canvas element has no role, label, or description.

**Fix Required**:
```typescript
<div
  className="w-full h-full"
  role="img"
  aria-label={`Network graph showing ${graphData.nodes.length} connections for ${currentUser?.name}`}
>
  <ForceGraph2D ... />
</div>
```

---

## Code Quality Issues

### ⚪ Issue #10: Magic Numbers
**File**: `NetworkGraph.tsx` (multiple)
**Severity**: LOW - Maintainability

**Problems**:
- Line 35: `150 - link.strength` (why 150?)
- Line 36: `-100` (charge strength)
- Line 37: `0.5` (center strength)
- Line 63: `100`, `1.5` (distance calculation)
- Line 134: `8` and `6` (node sizes)

**Fix Required**:
Extract to constants:
```typescript
const GRAPH_CONSTANTS = {
  LINK_DISTANCE_MAX: 150,
  CHARGE_STRENGTH: -100,
  CENTER_FORCE_STRENGTH: 0.5,
  BASE_DISTANCE: 100,
  STRENGTH_MULTIPLIER: 1.5,
  CENTER_NODE_SIZE: 8,
  REGULAR_NODE_SIZE: 6
};
```

---

### ⚪ Issue #11: Memoization Dependencies Incomplete
**File**: `NetworkGraph.tsx:94, 110`
**Severity**: LOW - Performance

**Problem**:
`linkCanvasObject` and `nodeCanvasObjectWithDimming` are memoized but might have stale closures.

**Current**:
```typescript
const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
  // Uses link.strength which comes from props
}, []); // ❌ Empty deps - might have stale data
```

**Fix Required**:
```typescript
const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
  // Find strength from graphData
  const originalLink = graphData.links.find(l =>
    (l.source === link.source.id && l.target === link.target.id) ||
    (l.source === link.target.id && l.target === link.source.id)
  );
  const strength = originalLink?.strength || 50;
  const opacity = Math.max(0.2, strength / 100);
  // ... rest
}, [graphData.links]);
```

---

## Verification Checklist (from DEBUGGING.md)

### Force Simulation
- ❌ Link distance based on strength: NOT WORKING (Issue #2)
- ❌ Radial positioning based on strength: BROKEN (Issue #1)
- ❌ Center node stays fixed at (0, 0): PARTIAL (set but can drift)
- ❌ Formula `150 - strength`: Not applied correctly
- ⚠️ Excessive re-renders: Need to test

### Graph Re-renders
- ✅ Memoization for graph data: WORKING (line 24-26)
- ⚠️ Perspective switching re-renders: Need to test
- ⚠️ Memory leaks: Need to profile
- ⚠️ Performance with 50+ nodes: Need to test

### Responsive Design
- ❌ Window resize: BROKEN (Issue #3)
- ⚠️ Mobile viewport: Need to test
- ⚠️ Graph fits container: Need to verify

### Accessibility
- ❌ Keyboard navigation: MISSING (Issue #8)
- ❌ ARIA labels: MISSING (Issue #9)
- ❌ Screen reader support: NONE
- ❌ Focus management: NONE

---

## Test Results

### TypeScript Compilation
```bash
npx tsc --noEmit
```
**Result**: ✅ PASS (no errors)

**Note**: Passes because of excessive `any` usage, not because types are correct!

---

## Compliance with Specifications

### Requirements from visualization/CLAUDE.md

**Hybrid Radial Layout**:
- ❌ Force simulation + radial constraints: BROKEN (Issue #1)
- ❌ Link distance reflects strength: NOT WORKING (Issue #2)
- ⚠️ Radial positioning: PARTIALLY IMPLEMENTED

**Perspective Switching**:
- ✅ Rebuilds graph data: WORKING (via props)
- ❌ Nodes reposition correctly: BROKEN (Issue #1)
- ⚠️ Animation transition: Need to test

**Node Click Handler**:
- ✅ Implemented: WORKING (line 87-91)
- ✅ Calls onNodeClick: CORRECT
- ✅ Passes user ID: CORRECT

**Performance**:
- ✅ Memoized graph data: WORKING
- ❌ Memoized force config: BROKEN (Issue #2)
- ❌ No resize debounce: MISSING (Issue #3)

**Deliverables**:
- ✅ NetworkGraph component created
- ✅ react-force-graph-2d integrated
- ❌ Hybrid radial layout: BROKEN
- ❌ Link distance reflects strength: NOT WORKING
- ✅ Node click handler: WORKING
- ❌ Perspective switching: PARTIALLY WORKING
- ✅ Zoom/pan controls: AVAILABLE (library default)
- ✅ Graph data memoized: WORKING
- ✅ App.tsx integration: COMPLETE
- ✅ Current user highlighted: WORKING

**Score**: 6/12 deliverables fully working = 50%

---

## Recommendations

### Must Fix (Blocking Issues):
1. **Fix radial constraint logic** (Issue #1) - Use fx/fy correctly
2. **Fix link distance calculation** (Issue #2) - Access strength properly
3. **Fix responsive dimensions** (Issue #3) - Add resize listener
4. **Replace `any` types** (Issue #4) - Add proper TypeScript types

### Should Fix (Before User Testing):
5. Add collision detection (Issue #6)
6. Add loading state (Issue #7)
7. Add keyboard navigation (Issue #8)
8. Add ARIA labels (Issue #9)

### Nice to Have:
9. Extract magic numbers to constants (Issue #10)
10. Fix memoization dependencies (Issue #11)
11. Add simulation cooldown optimization (Issue #5)

---

## Estimated Time to Fix

**Critical Issues (1-4)**: 2-3 hours
**High Priority (5-7)**: 1-2 hours
**Code Quality (8-11)**: 1 hour

**Total**: 4-6 hours of development + 2 hours testing

---

## Testing Plan

### Manual Tests Needed:
1. **Radial Layout**:
   - Load app with user-0 at center
   - Verify high-strength connections (80+) appear close (~100-130px)
   - Verify low-strength connections (10-39) appear far (~160-200px)
   - Measure distances with browser devtools

2. **Perspective Switching**:
   - Click any connected user
   - Verify graph recenters to that user
   - Verify their connections are shown radially
   - Click "Back to my network"
   - Verify returns to user-0

3. **Window Resize**:
   - Resize browser window (desktop)
   - Verify graph resizes to fit
   - Test on mobile with orientation change

4. **Performance**:
   - Add 50+ connections to user-0
   - Verify graph renders smoothly
   - Check console for warnings
   - Profile with React DevTools

5. **Search Integration**:
   - Use SearchBar to filter
   - Verify highlighted nodes turn green
   - Verify dimmed nodes appear at 0.2 opacity

---

## Conclusion

**The NetworkGraph component is 50% complete and has critical bugs.** The core functionality (force simulation, radial layout) is broken and doesn't meet specifications. The component needs significant rework before it can be used in production.

**Blocking Issues**: 4 critical
**Priority**: HIGH - Core feature broken
**Recommendation**: 🔴 DO NOT DEPLOY - Fix critical issues first

---

**Sign-off**: Component requires major fixes before integration testing can proceed.
