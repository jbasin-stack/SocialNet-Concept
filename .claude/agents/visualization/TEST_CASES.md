# NetworkGraph Component - Test Cases

**Component**: NetworkGraph.tsx
**Date**: 2026-02-01
**Total Test Cases**: 32

---

## Test Suite 1: Radial Layout Verification

### TC-1.1: Center Node Positioning
**Objective**: Verify current user is at graph center

**Steps**:
1. Load app (default user: user-0)
2. Open browser DevTools
3. Inspect canvas element
4. Measure center node position

**Expected Result**:
- Center node at coordinates (0, 0) relative to canvas center
- Node colored blue (#3b82f6)
- Node size: 8px radius (larger than others)

**Pass Criteria**: Center node within 5px of (0, 0)

---

### TC-1.2: High Strength Connections Distance
**Objective**: Verify high-strength connections appear close

**Prerequisites**:
- User-0 has connections with strength 80-100

**Steps**:
1. Load app
2. Identify nodes with strength 80-100 (check mockData.ts)
3. Measure distance from center to these nodes
4. Calculate: expected = 100 + (100 - strength) * 1.5

**Expected Result**:
- Strength 100: ~100px from center
- Strength 90: ~115px from center
- Strength 80: ~130px from center

**Pass Criteria**: Measured distance within ±10px of expected

---

### TC-1.3: Medium Strength Connections Distance
**Objective**: Verify medium-strength connections at medium distance

**Prerequisites**:
- User-0 has connections with strength 40-79

**Steps**:
1. Load app
2. Identify nodes with strength 40-79
3. Measure distances
4. Calculate expected distances

**Expected Result**:
- Strength 70: ~145px
- Strength 60: ~160px
- Strength 50: ~175px
- Strength 40: ~190px

**Pass Criteria**: Within ±10px of expected

---

### TC-1.4: Low Strength Connections Distance
**Objective**: Verify low-strength connections appear far

**Prerequisites**:
- User-0 has connections with strength 10-39

**Steps**:
1. Load app
2. Identify nodes with strength 10-39
3. Measure distances

**Expected Result**:
- Strength 30: ~205px
- Strength 20: ~220px
- Strength 10: ~235px

**Pass Criteria**: Within ±10px of expected

---

### TC-1.5: Angular Distribution
**Objective**: Verify nodes evenly distributed around circle

**Steps**:
1. Load app with user-0 (assume 10 connections)
2. Measure angle of each node from center
3. Calculate expected angles: (index / 10) * 360°

**Expected Result**:
- Nodes distributed at: 0°, 36°, 72°, 108°, ... 324°
- Even spacing around circle

**Pass Criteria**: Angle variance < 5°

---

### TC-1.6: Nodes Don't Overlap
**Objective**: Verify collision detection prevents overlap

**Steps**:
1. Load app
2. Find two nodes with similar strength values
3. Measure distance between them

**Expected Result**:
- Minimum 10px between any two node centers
- No visual overlap

**Pass Criteria**: All node pairs > 10px apart

---

## Test Suite 2: Perspective Switching

### TC-2.1: Click Node to Switch Perspective
**Objective**: Verify clicking a node recenters graph

**Steps**:
1. Load app (centered on user-0)
2. Click any connected user node (e.g., user-1)
3. Wait for graph to update
4. Observe graph structure

**Expected Result**:
- Business card modal opens for user-1
- Graph data unchanged (still showing user-0's network)
- Can click "View their network" button to switch

**Pass Criteria**: Modal opens, graph still centered on user-0

---

### TC-2.2: View Connected User's Network
**Objective**: Verify "View their network" button switches perspective

**Steps**:
1. Load app
2. Click user-1 node
3. Click "View their network" button in modal
4. Observe graph

**Expected Result**:
- Graph rebuilds with user-1 at center
- Shows only user-1's connections
- "Back to My Network" button appears in header
- Header shows "Viewing: [user-1 name]"

**Pass Criteria**: Graph recenters to user-1, shows their connections

---

### TC-2.3: Return to Original Network
**Objective**: Verify "Back to My Network" returns to user-0

**Steps**:
1. Switch to user-1's network (from TC-2.2)
2. Click "← Back to My Network" button
3. Observe graph

**Expected Result**:
- Graph rebuilds with user-0 at center
- Shows user-0's connections
- Button disappears
- Header shows "Viewing: You" (or user-0's name)

**Pass Criteria**: Returns to original network correctly

---

### TC-2.4: Radial Constraints Reapplied After Switch
**Objective**: Verify radial layout maintained on perspective switch

**Steps**:
1. Switch to user-1's network
2. Measure node positions (verify radial)
3. Switch back to user-0
4. Measure node positions again

**Expected Result**:
- Both views maintain radial layout
- Node distances reflect connection strengths
- No drift or misalignment

**Pass Criteria**: Radial layout correct in both views

---

### TC-2.5: Multiple Rapid Switches
**Objective**: Test stability under rapid perspective changes

**Steps**:
1. Click user-1 → "View their network"
2. Immediately click user-2 → "View their network"
3. Immediately click user-3 → "View their network"
4. Click "Back to My Network"

**Expected Result**:
- No errors in console
- Graph updates correctly each time
- Final state shows user-0's network
- No memory leaks

**Pass Criteria**: All switches work, no errors

---

## Test Suite 3: Responsive Design

### TC-3.1: Window Resize - Horizontal
**Objective**: Verify graph resizes when window width changes

**Steps**:
1. Load app in desktop browser (1920x1080)
2. Note graph dimensions
3. Resize window to 1280x1080
4. Observe graph

**Expected Result**:
- Graph width updates to fit new window width
- Graph height unchanged
- No horizontal scrollbar
- Nodes remain visible

**Pass Criteria**: Graph width = window.innerWidth

---

### TC-3.2: Window Resize - Vertical
**Objective**: Verify graph height adjusts to window height

**Steps**:
1. Load app
2. Resize window height from 1080px to 600px
3. Observe graph

**Expected Result**:
- Graph height = window.innerHeight - 120 (header height)
- No vertical scrollbar
- All nodes visible

**Pass Criteria**: Graph height adjusts correctly

---

### TC-3.3: Mobile Viewport (Portrait)
**Objective**: Test on mobile-sized viewport

**Steps**:
1. Open DevTools → Device Mode
2. Select iPhone 13 Pro (390x844)
3. Reload page
4. Observe layout

**Expected Result**:
- Graph fills viewport width (390px)
- Graph height = 844 - 120 = 724px
- Touch interactions work
- No horizontal scroll

**Pass Criteria**: Layout correct on mobile

---

### TC-3.4: Mobile Viewport (Landscape)
**Objective**: Test landscape orientation

**Steps**:
1. Device Mode → iPhone 13 Pro Landscape (844x390)
2. Reload page

**Expected Result**:
- Graph width = 844px
- Graph height = 390 - 120 = 270px
- Layout adapts correctly
- Header may wrap on small height

**Pass Criteria**: No layout breaks

---

### TC-3.5: Browser Zoom
**Objective**: Verify graph works at different zoom levels

**Steps**:
1. Load app
2. Set browser zoom to 150% (Ctrl/Cmd + +)
3. Verify layout
4. Set zoom to 50%
5. Verify layout

**Expected Result**:
- Graph scales correctly at all zoom levels
- No overflow
- Text remains readable

**Pass Criteria**: Works at 50%, 100%, 150%, 200% zoom

---

## Test Suite 4: Search Integration

### TC-4.1: Highlight Matching Nodes
**Objective**: Verify search highlights correct nodes

**Steps**:
1. Load app
2. Type "San Francisco" in search bar
3. Observe graph

**Expected Result**:
- Nodes with location "San Francisco" turn green (#10b981)
- Search shows "Found X results"
- Non-matching nodes dimmed to 20% opacity
- Center node (user-0) never dimmed

**Pass Criteria**: Correct nodes highlighted green

---

### TC-4.2: Dim Non-Matching Nodes
**Objective**: Verify non-matching nodes are dimmed

**Steps**:
1. Search for "Engineer"
2. Count dimmed vs highlighted nodes
3. Verify opacity

**Expected Result**:
- Nodes without "Engineer" in profile dimmed
- Dimmed nodes at 20% opacity (globalAlpha = 0.2)
- Links to dimmed nodes unchanged

**Pass Criteria**: Correct dimming applied

---

### TC-4.3: Clear Search
**Objective**: Verify clearing search restores all nodes

**Steps**:
1. Search for "Tech"
2. Note highlighted/dimmed nodes
3. Click "Clear" button (×)
4. Observe graph

**Expected Result**:
- All nodes return to full opacity
- All nodes return to default color (gray #6b7280)
- Center node stays blue
- Search shows "Found 20 results" (total users)

**Pass Criteria**: All nodes restored to normal

---

### TC-4.4: Search with No Results
**Objective**: Test edge case of no matches

**Steps**:
1. Search for "XYZ123NonexistentTerm"
2. Observe graph

**Expected Result**:
- All nodes dimmed except center node
- Search shows "Found 0 results"
- No errors in console

**Pass Criteria**: Handles gracefully, no crashes

---

### TC-4.5: Search During Perspective Switch
**Objective**: Verify search state preserved during switch

**Steps**:
1. Search for "Designer"
2. Note highlighted nodes
3. Switch to user-1's network
4. Observe graph

**Expected Result**:
- Search term preserved in input
- Highlighting applies to user-1's network
- Results count updates for new network

**Pass Criteria**: Search works across perspective switches

---

## Test Suite 5: Performance

### TC-5.1: Initial Load Time
**Objective**: Measure time to first render

**Steps**:
1. Open DevTools → Network tab
2. Reload page
3. Measure time from navigation to graph visible
4. Use Performance tab to record

**Expected Result**:
- Graph visible in < 1 second
- Loading message shows briefly
- Smooth transition to graph

**Pass Criteria**: < 1 second to visible graph

---

### TC-5.2: Simulation Cooldown
**Objective**: Verify simulation stops when settled

**Steps**:
1. Load app
2. Open Performance monitor (DevTools)
3. Watch CPU usage for 10 seconds
4. Note when CPU drops to idle

**Expected Result**:
- High CPU (30-50%) for 1-3 seconds
- CPU drops to < 5% after settling
- Graph animation stops
- Console log: simulation paused (if debugging enabled)

**Pass Criteria**: CPU drops below 5% within 5 seconds

---

### TC-5.3: Large Network Performance (50 Nodes)
**Objective**: Test with many connections

**Prerequisites**:
- Modify mockData.ts to create 50 connections for user-0

**Steps**:
1. Load app with 50-node network
2. Measure render time
3. Check for lag during simulation

**Expected Result**:
- Renders in < 2 seconds
- Smooth simulation (no stuttering)
- Radial layout maintained
- Memory usage < 100 MB

**Pass Criteria**: Acceptable performance with 50 nodes

---

### TC-5.4: Resize Performance
**Objective**: Verify smooth resize with no lag

**Steps**:
1. Load app
2. Rapidly resize window 10 times
3. Observe rendering

**Expected Result**:
- Graph updates smoothly
- No visible lag or flicker
- Frame rate stays > 30 FPS

**Pass Criteria**: Smooth resizing

---

### TC-5.5: Memory Leak Check
**Objective**: Verify no memory leaks on repeated actions

**Steps**:
1. Open DevTools → Memory tab
2. Take heap snapshot
3. Switch perspective 20 times
4. Take another heap snapshot
5. Compare memory usage

**Expected Result**:
- Memory increase < 10 MB
- No detached DOM nodes
- Event listeners cleaned up

**Pass Criteria**: Memory stable, no significant growth

---

## Test Suite 6: Accessibility

### TC-6.1: ARIA Labels Present
**Objective**: Verify graph has descriptive ARIA label

**Steps**:
1. Load app
2. Inspect graph container element
3. Check attributes

**Expected Result**:
```html
<div role="img" aria-label="Network graph showing 10 connections for You">
```

**Pass Criteria**: ARIA label present and descriptive

---

### TC-6.2: Screen Reader - Graph Description
**Objective**: Test with screen reader (NVDA/VoiceOver)

**Steps**:
1. Enable screen reader
2. Load app
3. Navigate to graph region
4. Listen to announcement

**Expected Result**:
- Announces: "Network graph showing X connections for [name]"
- Announces loading state when graph rebuilding

**Pass Criteria**: Graph announced correctly

---

### TC-6.3: Screen Reader - Node List
**Objective**: Verify hidden node list for screen readers

**Steps**:
1. Enable screen reader
2. Navigate to graph
3. Tab through elements
4. Listen for node announcements

**Expected Result**:
- Hidden list element present (sr-only class)
- Each node announced with name and strength
- List has aria-label="Network connections"

**Pass Criteria**: Nodes accessible to screen reader

---

### TC-6.4: Keyboard Focus Indicators
**Objective**: Verify visible focus indicators

**Steps**:
1. Load app
2. Tab through page
3. Observe focus states

**Expected Result**:
- Focus ring visible on interactive elements
- Skip to graph button (if added)
- Modal accessible via keyboard

**Pass Criteria**: All interactive elements have visible focus

---

## Test Suite 7: Link Distance & Rendering

### TC-7.1: Link Distance Reflects Strength
**Objective**: Verify link visual length matches strength

**Steps**:
1. Load app
2. Find connection with strength 90
3. Find connection with strength 30
4. Compare visual link lengths

**Expected Result**:
- Strength 90: shorter link (~60px)
- Strength 30: longer link (~120px)
- Formula: 150 - strength

**Pass Criteria**: Visual difference observable

---

### TC-7.2: Link Opacity Based on Strength
**Objective**: Verify link opacity varies with strength

**Steps**:
1. Load app
2. Observe links to high-strength nodes
3. Observe links to low-strength nodes

**Expected Result**:
- High strength (80+): opacity ~0.8-1.0
- Medium strength (50): opacity ~0.5
- Low strength (20): opacity ~0.2 (minimum)

**Pass Criteria**: Opacity difference visible

---

### TC-7.3: All Links Connected to Center
**Objective**: Verify all links originate from center node

**Steps**:
1. Load app
2. Count links
3. Trace each link to center

**Expected Result**:
- Number of links = number of connections
- All links connect center to outer nodes
- No links between outer nodes

**Pass Criteria**: Star topology (center to all)

---

## Test Suite 8: Edge Cases

### TC-8.1: Single Connection
**Objective**: Test with minimum data (1 connection)

**Prerequisites**:
- Modify mockData to have only 1 connection

**Steps**:
1. Load app
2. Observe graph

**Expected Result**:
- 2 nodes displayed (user-0 + 1 connected user)
- 1 link between them
- Radial layout still applied
- No errors

**Pass Criteria**: Works with minimal data

---

### TC-8.2: Maximum Connections (19 nodes)
**Objective**: Test with all possible connections for user-0

**Steps**:
1. Use NFC simulator to connect to all users
2. Verify graph

**Expected Result**:
- 20 nodes total (user-0 + 19 connections)
- 19 links
- Radial distribution maintained
- Performance acceptable

**Pass Criteria**: Handles maximum connections

---

### TC-8.3: All Same Strength
**Objective**: Test with uniform strength values

**Prerequisites**:
- Set all connections to strength 50

**Steps**:
1. Load app
2. Measure node distances

**Expected Result**:
- All nodes at same distance from center (~175px)
- Even angular distribution
- Forms perfect circle

**Pass Criteria**: Uniform ring of nodes

---

### TC-8.4: Zoom to Extreme Levels
**Objective**: Test graph zoom limits

**Steps**:
1. Load app
2. Zoom in to maximum
3. Zoom out to maximum

**Expected Result**:
- Graph remains functional at all zoom levels
- Labels scale appropriately
- No overflow or clipping

**Pass Criteria**: Stable at extreme zoom

---

## Test Suite 9: Integration

### TC-9.1: Node Click Opens Modal
**Objective**: Verify clicking node triggers modal

**Steps**:
1. Load app
2. Click any non-center node
3. Observe modal

**Expected Result**:
- BusinessCardModal opens
- Correct user's data displayed
- Modal animates in smoothly

**Pass Criteria**: Modal opens with correct data

---

### TC-9.2: NFC Tap Adds Node to Graph
**Objective**: Verify new connections appear immediately

**Steps**:
1. Load app
2. Click NFC button (bottom-right)
3. Click "Tap to Connect"
4. Observe graph

**Expected Result**:
- New node appears in graph
- Positioned radially based on random strength (30-70)
- Link to center visible
- Graph re-renders smoothly

**Pass Criteria**: New connection visible immediately

---

### TC-9.3: localStorage Persistence
**Objective**: Verify graph state persists across reloads

**Steps**:
1. Add 3 new connections via NFC
2. Note graph structure
3. Reload page
4. Observe graph

**Expected Result**:
- All 3 new connections still present
- Positions recalculated (radial layout)
- No data loss

**Pass Criteria**: Connections persist

---

## Summary

**Total Test Cases**: 32
**Test Suites**: 9

**Critical Tests** (must pass):
- TC-1.1 through TC-1.6 (Radial Layout)
- TC-2.1 through TC-2.4 (Perspective Switching)
- TC-3.1 through TC-3.2 (Responsive)
- TC-5.1, TC-5.2 (Performance)
- TC-9.1, TC-9.2 (Integration)

**Recommended Tests** (should pass):
- TC-4.x (Search)
- TC-6.x (Accessibility)
- TC-7.x (Link Rendering)

**Nice to Have Tests**:
- TC-8.x (Edge Cases)

**Estimated Testing Time**: 3-4 hours for full suite

---

**Notes**:
- Use Chrome DevTools for most measurements
- Enable React DevTools Profiler for performance tests
- Test on real devices for mobile tests (not just DevTools simulation)
- Document any failures with screenshots
