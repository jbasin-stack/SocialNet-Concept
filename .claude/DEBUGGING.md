# Debugging & Optimization Guide

## Purpose
Instructions for debugging agent to review all work, identify issues, and optimize the application.

## Performance Issues

### Force Simulation
- [ ] Check if force simulation constraints are working correctly
- [ ] Verify nodes are positioned radially based on connection strength
- [ ] Test that center node stays fixed at (0, 0)
- [ ] Ensure link distances reflect strength accurately (formula: 150 - strength)
- [ ] Check for excessive re-renders when graph updates

### Graph Re-renders
- [ ] Verify memoization is working for graph data transformations
- [ ] Check if perspective switching causes unnecessary full re-renders
- [ ] Profile component render times with React DevTools
- [ ] Look for memory leaks when adding/removing connections
- [ ] Test with 50+ nodes to identify performance degradation

### Search Performance
- [ ] Verify Fuse.js configuration is optimal (threshold, keys)
- [ ] Check if search filtering causes lag with many nodes
- [ ] Test edge cases: empty search, special characters, very long queries

## Functional Issues

### Search Filter Accuracy
- [ ] Test filtering by location (exact and partial matches)
- [ ] Test filtering by interests (array matching)
- [ ] Test filtering by industry
- [ ] Verify highlighted nodes match filter criteria exactly
- [ ] Check if dimmed nodes are correct non-matches

### Word Counter Edge Cases
- [ ] Test with exactly 150 words
- [ ] Test with 151+ words (should show red)
- [ ] Test with special characters, punctuation
- [ ] Test with multiple spaces between words
- [ ] Verify color transitions: green < 130, yellow 130-150, red > 150

### localStorage Edge Cases
- [ ] Test save/load with empty graph
- [ ] Test save/load with maximum connections
- [ ] Verify auto-save triggers on connection add/remove
- [ ] Check quota exceeded errors (unlikely but possible)
- [ ] Test corruption recovery (invalid JSON)

### Perspective Switching
- [ ] Verify clicked node becomes new center
- [ ] Check that only direct connections of selected user are shown
- [ ] Test "back to my network" functionality
- [ ] Ensure smooth transition animation
- [ ] Verify node/link data updates correctly

## Cross-Browser Compatibility

### Test Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Known Issues
- [ ] Canvas rendering differences
- [ ] localStorage availability
- [ ] CSS Grid/Flexbox inconsistencies
- [ ] Animation performance

## Mobile Responsive Issues

### Breakpoints to Test
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

### Specific Checks
- [ ] Touch events work for node clicks
- [ ] Pinch-to-zoom on graph
- [ ] Modal fits on small screens
- [ ] Search bar doesn't overflow
- [ ] NFC button positioned correctly (floating)
- [ ] Text remains readable at all sizes

## Accessibility Audit

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space to activate buttons
- [ ] Escape to close modals
- [ ] Focus visible on all elements

### ARIA Labels
- [ ] Nodes have descriptive labels
- [ ] Buttons have clear purposes
- [ ] Modal has correct role and labeling
- [ ] Search has associated label

### Color Contrast
- [ ] Text passes WCAG AA (4.5:1)
- [ ] Interactive elements distinguishable
- [ ] Node colors accessible
- [ ] Status indicators (word counter) clear

## Optimization Checklist

### Code Quality
- [ ] No unused imports
- [ ] No console.log statements in production
- [ ] TypeScript strict mode enabled
- [ ] No `any` types (use proper types)
- [ ] Error boundaries implemented

### Bundle Size
- [ ] Check bundle size with `npm run build`
- [ ] Verify code splitting is working
- [ ] Check if dependencies are tree-shaken
- [ ] Consider lazy loading for modals

### Data Efficiency
- [ ] Graph transformations memoized
- [ ] Connection strength calculations cached
- [ ] User subgraphs pre-calculated
- [ ] localStorage reads minimized

## Testing Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Lint
npm run lint (if configured)
```

## Common Issues & Fixes

### Graph Not Rendering
- Check if react-force-graph-2d is imported correctly
- Verify graph data format matches library expectations
- Check canvas element is in DOM
- Look for JavaScript errors in console

### Nodes Not Positioned Radially
- Verify force simulation config (linkDistance, charge)
- Check if radial constraints are applied after simulation
- Test with simpler mock data (fewer nodes)

### Modal Not Appearing
- Check z-index conflicts
- Verify Framer Motion animations
- Test click event handlers
- Check if node data is passed correctly

### Search Not Working
- Verify Fuse.js initialization
- Check search keys match data structure
- Test with simple exact-match first
- Look for case sensitivity issues
