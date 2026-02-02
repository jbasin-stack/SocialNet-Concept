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

---

## CRITICAL LESSONS LEARNED - READ BEFORE MAKING CHANGES

### 1. Canvas Rendering and CSS Variables ⚠️ CRITICAL

**WRONG (will cause invisible nodes):**
```javascript
ctx.fillStyle = 'rgb(var(--graph-center-node))';  // Canvas doesn't understand this!
ctx.strokeStyle = 'rgba(var(--graph-link), 0.5)';  // This fails silently
```

**CORRECT:**
```javascript
const styles = getComputedStyle(document.documentElement);
const colorRGB = styles.getPropertyValue('--graph-center-node').trim();
ctx.fillStyle = `rgb(${colorRGB})`;  // Actual value: "rgb(10, 132, 255)"
```

**Why:** Canvas 2D context is JavaScript, not CSS. It doesn't parse CSS variable syntax. CSS variables MUST be computed first using `getComputedStyle()`.

**Symptoms if wrong:** Red background visible, but no nodes/links render. Console shows no errors.

---

### 2. Git Commits Required for Vercel Deployment ⚠️ CRITICAL

**MISTAKE:** Making local file changes, building successfully, deploying to Vercel, but changes don't appear live.

**ROOT CAUSE:** Vercel deploys from the **git repository**, not local files.

**REQUIRED WORKFLOW:**
```bash
# 1. Make changes to files
# 2. Build and test locally
npm run build

# 3. COMMIT TO GIT (don't skip this!)
git add -A
git commit -m "Description of changes"

# 4. PUSH TO REMOTE
git push origin main

# 5. THEN deploy
vercel --prod
```

**Verification:**
```bash
git status  # Should show "nothing to commit, working tree clean"
git log --oneline -1  # Verify latest commit includes your changes
```

**Symptoms if wrong:** Local build works, but deployed site shows old version. Hard refresh doesn't help.

---

### 3. D3 Force Simulation - Custom Forces Must Be Correct ⚠️ CRITICAL

**WRONG (causes undefined node positions):**
```javascript
fg.d3Force('radial', () => {
  const nodes = fg.graphData().nodes;  // ERROR: graphData() not available in force context
  nodes.forEach(node => {
    // manipulate node positions
  });
});
```

**Symptoms:** Nodes render with `x: undefined, y: undefined`. Console error: `T.graphData is not a function`.

**CORRECT (if custom force needed):**
```javascript
// Option 1: Use D3's built-in forces
fg.d3Force('radial', d3.forceRadial(radius, x, y));

// Option 2: Proper custom force function signature
fg.d3Force('radial', (alpha) => {
  // Access nodes through the force's internal structure
  // Must follow D3 force API
});

// Option 3: Don't use custom radial force at all
// Let standard forces (link, charge, center, collide) do the work
```

**Best practice:** Use D3's built-in forces unless you have deep D3 expertise. Custom forces are easy to break.

---

### 4. Systematic Diagnosis Before Acting ⚠️ IMPORTANT

**WRONG APPROACH:**
- User reports problem
- Jump to assumed solution
- Deploy
- Still broken
- Repeat

**CORRECT APPROACH:**
1. **List ALL possible issues** (not just the most obvious one)
2. **Rank by likelihood** based on symptoms
3. **Add diagnostic logging** to confirm root cause
4. **Test hypotheses** with extreme cases (bright colors, large sizes)
5. **Fix verified issue** (not assumed issue)
6. **Deploy once** with confidence

**Example:** When user says "I see nothing":
- Don't assume it's CSS
- Don't assume it's data
- Add logging to see: dimensions, node count, render callbacks, positions
- Use extreme visibility (red background, bright green nodes) to isolate issue
- Check console for actual errors

---

### 5. Canvas Debugging Techniques 🔧

**When canvas appears blank:**

```javascript
// Test 1: Is canvas rendering at all?
backgroundColor="#FF0000"  // Bright red - if you see red, canvas exists

// Test 2: Are render callbacks being called?
const nodeCanvasObject = (node, ctx) => {
  console.log('NODE RENDER:', node.id, node.x, node.y);  // Log every call
  // ... drawing code
};

// Test 3: Use impossible-to-miss visuals
const nodeSize = 30;  // Much bigger than normal 6-8px
ctx.fillStyle = '#00FF00';  // Bright green
ctx.strokeStyle = '#000000';  // Black border
ctx.lineWidth = 3;  // Thick border

// Test 4: Check positions are valid
if (node.x === undefined || node.y === undefined) {
  console.error('INVALID POSITION:', node);
}
```

**Debugging checklist:**
- ✅ Canvas element exists in DOM (`<canvas>` tag present)
- ✅ Canvas has dimensions > 0 (`width` and `height` attributes)
- ✅ Background color is visible (confirms canvas renders)
- ✅ Render callbacks are being called (console logs appear)
- ✅ Node positions are defined (not `undefined`)
- ✅ Colors are valid strings (not CSS variable syntax)
- ✅ No JavaScript errors in console

---

### 6. Modal Positioning - Center Modals Properly 🔧

**WRONG (renders in corner):**
```jsx
className="fixed inset-x-4 bottom-4 md:inset-auto ..."
```

**CORRECT (always centered):**
```jsx
className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           w-full max-w-2xl mx-4 max-h-[90vh]"
```

**Key properties:**
- `top-1/2 left-1/2` - Position at center
- `-translate-x-1/2 -translate-y-1/2` - Offset by own dimensions
- `max-h-[90vh]` - Prevent overflow on small screens
- `overflow-hidden flex flex-col` - Proper scrolling container

---

### 7. When User Gets Frustrated - Action Plan 🚨

**If user says "it's not working" or "you're stupid":**

1. **STOP** - Don't keep trying solutions randomly
2. **ACKNOWLEDGE** - "You're right, let me diagnose this properly"
3. **CREATE LIST** - Write out ALL possible issues (10-20 items)
4. **ASK FOR DATA** - "Open console, send me the exact errors/logs"
5. **ADD VISIBILITY** - Bright colors, debug overlays, console logs
6. **FIX VERIFIED ISSUE** - Not assumed issue
7. **ONE DEPLOY** - Get it right, don't spam deployments

**Never:**
- Make multiple untested changes at once
- Deploy without verifying locally first
- Assume the problem without evidence
- Skip git commit step
- Ignore user's specific symptoms

---

### 8. Force Graph Library Specifics 📚

**react-force-graph-2d peculiarities:**

```javascript
// Node rendering must handle both object and string source/target
const start = typeof link.source === 'string'
  ? { x: 0, y: 0 }  // Fallback if not resolved yet
  : link.source;    // Use actual node object

// Labels can be disabled with empty string
nodeLabel={() => ''}  // Prevents default tooltip

// Background MUST be computed if using CSS variables
backgroundColor={`rgb(${getComputedStyle(document.documentElement)
  .getPropertyValue('--graph-background').trim()})`}

// Dimensions must account for header
height={window.innerHeight - HEADER_HEIGHT}

// Cool down time should be reasonable (not too long)
cooldownTime={1000}  // 1 second, not 3+ seconds
```

---

### 9. Build Before Deploy Checklist ✅

Before running `vercel --prod`:

```bash
# 1. TypeScript compiles
npm run build  # Must succeed with 0 errors

# 2. Changes committed
git status  # Should be clean

# 3. Changes pushed
git log origin/main..HEAD  # Should show no unpushed commits

# 4. Test locally if possible
npm run dev  # Verify changes work

# 5. Then deploy
vercel --prod
```

---

## Summary of Critical Fixes Applied

1. **Canvas color rendering** - Use `getComputedStyle()` to read CSS variables
2. **Git workflow** - Always commit and push before deploying
3. **D3 force simulation** - Removed broken custom radial force
4. **Modal centering** - Fixed BusinessCardModal positioning
5. **Diagnostic approach** - Added systematic debugging instead of guessing

**These lessons prevent hours of frustration and broken deployments.**
