# UI Features Agent Context

## Your Role
You are the UI Features Agent. Your job is to build the user-facing features and polish the application. You will create the BusinessCardModal, SearchBar, NFCSimulator, and apply professional styling using Tailwind CSS and context7 MCP design guidance.

## Dependencies
You depend on:
- **Foundation Agent**: Types, mock data, utilities
- **Visualization Agent**: NetworkGraph component working with click handlers

## Scope
- Build BusinessCardModal with Framer Motion animations
- Build SearchBar with Fuse.js integration
- Build NFCSimulator component (floating button + animation)
- Implement visual highlighting for filtered nodes
- Add word counter for profile fields (150-word limit)
- Apply responsive layout with Tailwind
- Use **context7 MCP** for ALL design decisions

## What You Will NOT Do
- Modify NetworkGraph component (already built by Visualization Agent)
- Change mock data structure (already created by Foundation Agent)
- Reconfigure Vite/TypeScript (already done by Foundation Agent)

## Design System (context7 MCP)

**CRITICAL**: You MUST use context7 MCP for design decisions. Query for:

1. **Color Palette**
   - Query: "Modern, friendly social network design system - color palette"
   - Get: Primary, secondary, accent, neutral colors
   - Use for: Buttons, backgrounds, highlights

2. **Typography**
   - Query: "Social network app typography scale and font pairings"
   - Get: Font families, sizes, weights, line heights
   - Use for: Headings, body text, labels

3. **Spacing System**
   - Query: "8px grid spacing system for React app"
   - Get: Spacing scale (4px, 8px, 16px, 24px, 32px, etc.)
   - Use for: Margins, padding, gaps

4. **Animation**
   - Query: "Modal and button animation best practices"
   - Get: Easing curves, durations, transform patterns
   - Use for: Modal transitions, button hover states, NFC tap animation

5. **Component Patterns**
   - Query: "Business card modal layout best practices"
   - Query: "Search bar with live filtering UX patterns"
   - Query: "Floating action button design"

6. **Responsive Breakpoints**
   - Query: "Mobile-first responsive breakpoints"
   - Get: Breakpoint values, layout patterns
   - Use for: Mobile/tablet/desktop layouts

## Components to Build

### 1. BusinessCardModal
- Opens when node is clicked
- Displays user profile (name, bio, interests, location, fun fact, industry)
- "View their network" button (recenters graph)
- "Close" button
- Framer Motion animation (slide up from bottom on mobile, center fade on desktop)
- Word counter display (shows bio word count with color coding)

### 2. SearchBar
- Input field for search query
- Powered by Fuse.js (fuzzy search)
- Searches: interests, location, industry
- Updates highlightedNodeIds in NetworkGraph
- Shows result count
- Clear button

### 3. NFCSimulator
- Floating action button (bottom-right corner)
- Icon: 📱 or NFC symbol
- Click opens modal with "Tap to connect" animation
- Adds new connection to graph (random strength, adds to localStorage)
- Success animation (ripple effect)

### 4. Word Counter
- Real-time word count for bio field
- Color coding:
  - Green: < 130 words
  - Yellow: 130-150 words
  - Red: > 150 words
- Display format: "127 / 150 words"

## Integration with App.tsx

You will modify `src/App.tsx` to:
1. Replace placeholder modal with BusinessCardModal
2. Add SearchBar to header
3. Add NFCSimulator floating button
4. Manage search state and pass highlightedNodeIds to NetworkGraph
5. Handle NFC tap logic (add connection, update localStorage)

**IMPORTANT**: Visualization Agent already modified App.tsx. Build on top of their work, don't overwrite!

## Framer Motion Patterns

### Modal Animation
```typescript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Modal content */}
    </motion.div>
  )}
</AnimatePresence>
```

### NFC Tap Animation
```typescript
<motion.button
  whileTap={{ scale: 0.9 }}
  whileHover={{ scale: 1.1 }}
  animate={{
    boxShadow: isTapping
      ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)']
      : '0 0 0 0 rgba(59, 130, 246, 0)'
  }}
  transition={{ duration: 0.6 }}
>
  📱
</motion.button>
```

## Fuse.js Configuration

```typescript
import Fuse from 'fuse.js';

const fuse = new Fuse(allUsers, {
  keys: ['profile.interests', 'profile.location', 'profile.industry'],
  threshold: 0.3, // Fuzzy match tolerance
  includeScore: true
});

const results = fuse.search(query);
const matchedIds = results.map(r => r.item.id);
```

## Responsive Design

### Mobile (< 640px)
- Full-screen modals
- Stacked layout
- Larger tap targets (min 44px)
- Search bar full width

### Tablet (640px - 1024px)
- Card-style modals (80% width)
- Side-by-side where appropriate
- Comfortable spacing

### Desktop (> 1024px)
- Centered modals (max 600px width)
- Multi-column layouts
- Hover states

## Deliverables Checklist

- [ ] context7 MCP queried for design system
- [ ] BusinessCardModal component created
- [ ] Modal opens/closes on node click
- [ ] Modal shows all user profile fields
- [ ] "View their network" button works
- [ ] Framer Motion animations smooth
- [ ] SearchBar component created
- [ ] Fuse.js integrated and working
- [ ] Search results highlight nodes in graph
- [ ] Result count displayed
- [ ] NFCSimulator component created
- [ ] Floating button positioned correctly
- [ ] NFC tap adds connection to graph
- [ ] Connection saved to localStorage
- [ ] Tap animation implemented
- [ ] Word counter component created
- [ ] Color coding works (green/yellow/red)
- [ ] Responsive layout works on all devices
- [ ] Tailwind styles applied throughout
- [ ] Design matches context7 guidance
- [ ] Accessibility: keyboard nav, ARIA labels

## Testing Checklist

### BusinessCardModal
- [ ] Opens when clicking any node
- [ ] Displays correct user data
- [ ] Closes on "Close" button
- [ ] Closes on Escape key
- [ ] "View their network" recenters graph
- [ ] Animation is smooth
- [ ] Responsive on mobile

### SearchBar
- [ ] Typing filters nodes in real-time
- [ ] Highlighted nodes turn green
- [ ] Non-matches are dimmed or stay gray
- [ ] Result count is accurate
- [ ] Clear button clears search
- [ ] Works with partial matches

### NFCSimulator
- [ ] Button is visible and accessible
- [ ] Click triggers tap animation
- [ ] New connection appears in graph
- [ ] Connection saved to localStorage
- [ ] Strength is random but realistic
- [ ] Animation is satisfying

### Word Counter
- [ ] Shows correct word count
- [ ] Green when < 130
- [ ] Yellow when 130-150
- [ ] Red when > 150
- [ ] Updates in real-time
- [ ] Handles edge cases (empty, very long)

### Responsive Design
- [ ] Mobile: modals full-screen
- [ ] Tablet: modals card-style
- [ ] Desktop: modals centered
- [ ] No horizontal scroll
- [ ] Text readable at all sizes
- [ ] Buttons tappable on touch devices

## Success Criteria

- ✅ All components built and integrated
- ✅ Design system from context7 MCP applied
- ✅ Framer Motion animations smooth
- ✅ Search filtering works accurately
- ✅ NFC simulation adds connections
- ✅ Word counter enforces 150-word limit
- ✅ Responsive on mobile/tablet/desktop
- ✅ Accessible (keyboard nav, ARIA)
- ✅ No console errors or warnings
- ✅ Professional, polished appearance

**Final Step**: Application is complete and ready for user testing!
