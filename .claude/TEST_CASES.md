# UI Features Test Cases
**Date**: 2026-01-31
**Status**: Ready for Manual Testing

---

## Test Environment Setup

1. Run development server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Open browser DevTools Console to monitor errors
4. Open React DevTools (if available) to monitor renders

---

## Test Suite 1: SearchBar Performance & Functionality

### Test 1.1: Fuse.js Instance Memoization ✅ FIXED
**Objective**: Verify Fuse.js is not recreated on every render

**Steps**:
1. Open React DevTools Profiler
2. Start recording
3. Type slowly in search bar: "San"
4. Stop recording
5. Check render times

**Expected**:
- SearchBar should render in < 5ms per keystroke
- No warning about missing dependencies in console
- Smooth typing experience with no lag

**Pass Criteria**: No performance degradation, consistent render times

---

### Test 1.2: Search by Location
**Objective**: Verify location-based filtering works

**Steps**:
1. Clear search bar (if populated)
2. Type: "San Francisco"
3. Observe results count
4. Check business card modal by clicking on test button

**Expected**:
- Result count: 4 results (user-0, user-1, user-3, plus any others in SF)
- Status: "4 results found"

**Pass Criteria**: Correct users highlighted/returned

---

### Test 1.3: Search by Interest
**Objective**: Verify interest-based filtering works

**Steps**:
1. Clear search bar
2. Type: "Photography"
3. Observe results

**Expected**:
- Result count: 3+ results (user-0, user-1, user-16)
- All results have "Photography" in interests array

**Pass Criteria**: All matches contain the interest

---

### Test 1.4: Search by Industry
**Objective**: Verify industry-based filtering works

**Steps**:
1. Clear search bar
2. Type: "Healthcare"
3. Observe results

**Expected**:
- Result count: 2 results (user-5, user-11)
- Status shows correct count

**Pass Criteria**: Correct industry matches

---

### Test 1.5: Fuzzy Search
**Objective**: Verify Fuse.js fuzzy matching works

**Steps**:
1. Clear search bar
2. Type: "photografy" (misspelled)
3. Observe results

**Expected**:
- Result count: > 0 (should still match "Photography")
- Fuzzy threshold of 0.3 allows minor typos

**Pass Criteria**: Fuzzy matching works for typos

---

### Test 1.6: Clear Button
**Objective**: Verify clear button works

**Steps**:
1. Type: "Tech"
2. Click X (clear) button
3. Observe search bar and results

**Expected**:
- Search bar is empty
- Result count disappears
- highlightedNodeIds = []

**Pass Criteria**: Search fully resets

---

### Test 1.7: Empty Search
**Objective**: Verify empty search shows no results

**Steps**:
1. Ensure search bar is empty
2. Verify no result count is shown

**Expected**:
- No result count text
- No highlighted nodes

**Pass Criteria**: Empty search is handled correctly

---

## Test Suite 2: Word Counter

### Test 2.1: Empty Bio ✅ FIXED
**Objective**: Verify empty bio shows 0 words

**Steps**:
1. Modify mockData.ts temporarily:
   ```typescript
   bio: ''
   ```
2. Reload app
3. Click "Open Sample Business Card" button
4. Check word count

**Expected**:
- Word count: "0 / 150 words"
- Color: Green (text-green-600)

**Pass Criteria**: Empty string shows 0 words, not 1

---

### Test 2.2: Whitespace-Only Bio ✅ FIXED
**Objective**: Verify whitespace-only bio shows 0 words

**Steps**:
1. Modify mockData.ts temporarily:
   ```typescript
   bio: '   '
   ```
2. Reload app
3. Click "Open Sample Business Card" button
4. Check word count

**Expected**:
- Word count: "0 / 150 words"
- Color: Green (text-green-600)

**Pass Criteria**: Whitespace-only shows 0 words

---

### Test 2.3: Single Word
**Objective**: Verify single word is counted correctly

**Steps**:
1. Modify mockData.ts temporarily:
   ```typescript
   bio: 'Hello'
   ```
2. Reload app
3. Check word count

**Expected**:
- Word count: "1 / 150 words"
- Color: Green

**Pass Criteria**: Single word counted correctly

---

### Test 2.4: Multiple Spaces Between Words
**Objective**: Verify multiple spaces don't affect count

**Steps**:
1. Modify mockData.ts:
   ```typescript
   bio: 'Hello    world    test'
   ```
2. Check word count

**Expected**:
- Word count: "3 / 150 words"
- Color: Green

**Pass Criteria**: Extra spaces ignored

---

### Test 2.5: Exactly 130 Words (Green Threshold)
**Objective**: Verify color changes at 130 words

**Steps**:
1. Create bio with exactly 129 words
2. Check color (should be green)
3. Add one word (130 total)
4. Check color (should be yellow)

**Expected**:
- 129 words: Green (text-green-600)
- 130 words: Yellow (text-yellow-600)

**Pass Criteria**: Color transitions at correct threshold

---

### Test 2.6: Exactly 150 Words (Yellow Threshold)
**Objective**: Verify color changes at 150 words

**Steps**:
1. Create bio with exactly 150 words
2. Check color (should be yellow)
3. Add one word (151 total)
4. Check color (should be red)

**Expected**:
- 150 words: Yellow (text-yellow-600)
- 151 words: Red (text-red-600)

**Pass Criteria**: Color transitions at 150 words

---

### Test 2.7: Over 150 Words (Red)
**Objective**: Verify red color for excessive words

**Steps**:
1. Create bio with 200 words
2. Check color

**Expected**:
- Word count: "200 / 150 words"
- Color: Red (text-red-600)

**Pass Criteria**: Red color for > 150 words

---

## Test Suite 3: BusinessCardModal

### Test 3.1: Modal Opens on Button Click
**Objective**: Verify modal opens correctly

**Steps**:
1. Click "Open Sample Business Card" button
2. Observe modal appearance

**Expected**:
- Modal slides up from bottom on mobile
- Modal fades in at center on desktop
- Backdrop appears (semi-transparent black)
- Animation is smooth (300ms ease-out)

**Pass Criteria**: Modal opens with correct animation

---

### Test 3.2: Modal Displays All Fields
**Objective**: Verify all user data is shown

**Steps**:
1. Open business card modal
2. Check for all fields:
   - Name
   - Location
   - Industry
   - Bio
   - Interests (as tags)
   - Fun Fact
   - Word counter

**Expected**:
- All fields visible
- Interests shown as blue pills
- Word counter shows color-coded count

**Pass Criteria**: All data displayed correctly

---

### Test 3.3: Close Button Works
**Objective**: Verify close button closes modal

**Steps**:
1. Open modal
2. Click X (close) button in top-right
3. Observe modal closing

**Expected**:
- Modal animates out (reverse animation)
- Backdrop fades out
- Modal state resets

**Pass Criteria**: Modal closes smoothly

---

### Test 3.4: Escape Key Closes Modal ✅ VERIFIED
**Objective**: Verify Escape key accessibility

**Steps**:
1. Open modal
2. Press Escape key
3. Observe modal closing

**Expected**:
- Modal closes immediately
- Same animation as close button

**Pass Criteria**: Escape key works

---

### Test 3.5: "View Their Network" Button
**Objective**: Verify perspective switching

**Steps**:
1. Open modal for user-1 (Sarah Chen)
2. Click "View Their Network" button
3. Observe UI changes

**Expected**:
- Modal closes
- Header shows: "Viewing: Sarah Chen"
- "Back to My Network" button appears
- (NetworkGraph would recenter - placeholder for now)

**Pass Criteria**: State updates correctly

---

### Test 3.6: "Close" Button in Footer
**Objective**: Verify secondary close button

**Steps**:
1. Open modal
2. Click "Close" button in footer
3. Observe modal closing

**Expected**:
- Same behavior as X button
- Modal closes smoothly

**Pass Criteria**: Secondary close button works

---

### Test 3.7: Backdrop Click Closes Modal
**Objective**: Verify clicking backdrop closes modal

**Steps**:
1. Open modal
2. Click on dark area outside modal
3. Observe modal closing

**Expected**:
- Modal closes
- Animation plays

**Pass Criteria**: Backdrop click works

---

## Test Suite 4: NFCSimulator

### Test 4.1: Floating Button Visible
**Objective**: Verify FAB is positioned correctly

**Steps**:
1. Load app
2. Check bottom-right corner
3. Verify button visibility

**Expected**:
- Button visible at bottom-right (fixed positioning)
- Offset: 32px from bottom, 32px from right
- Round button with 📱 icon
- Blue background (bg-blue-600)

**Pass Criteria**: Button positioned correctly

---

### Test 4.2: FAB Hover Animation
**Objective**: Verify hover effect

**Steps**:
1. Hover over FAB
2. Observe scale animation

**Expected**:
- Button scales to 1.1x (10% larger)
- Smooth transition
- Background changes to blue-700

**Pass Criteria**: Hover animation smooth

---

### Test 4.3: FAB Opens Modal
**Objective**: Verify clicking FAB opens NFC modal

**Steps**:
1. Click FAB
2. Observe modal appearance

**Expected**:
- Modal appears at center
- Title: "NFC Connection"
- Text: "Tap to simulate a new connection"
- Large tap button with 👋 emoji
- Cancel button visible

**Pass Criteria**: NFC modal opens

---

### Test 4.4: NFC Tap Animation
**Objective**: Verify tap creates connection

**Steps**:
1. Open NFC modal
2. Click large tap button (👋)
3. Observe animation

**Expected**:
- Ripple animation (expanding box-shadow)
- Emoji changes: 👋 → ✓
- "Connection added!" message appears
- Modal auto-closes after 1.5s

**Pass Criteria**: Tap animation works, connection added

---

### Test 4.5: Connection Actually Added
**Objective**: Verify new connection is saved

**Steps**:
1. Note current connection count
2. Perform NFC tap (Test 4.4)
3. Check connection count

**Expected**:
- Connection count increases by 1
- New connection has random strength (30-70)
- Connection saved to localStorage
- Persistence verified (reload page, count same)

**Pass Criteria**: Connection persisted correctly

---

### Test 4.6: All Users Connected
**Objective**: Verify behavior when no more connections possible

**Steps**:
1. Perform NFC taps until all users connected (19 total)
2. Try one more tap
3. Observe alert

**Expected**:
- Alert: "You are already connected to everyone!"
- No new connection added
- Modal remains open

**Pass Criteria**: Edge case handled correctly

---

### Test 4.7: Cancel Button
**Objective**: Verify cancel closes modal

**Steps**:
1. Open NFC modal
2. Click "Cancel" button
3. Observe modal closing

**Expected**:
- Modal closes
- No connection added
- FAB remains visible

**Pass Criteria**: Cancel works

---

## Test Suite 5: localStorage Persistence

### Test 5.1: Save on Connection Add ✅ VERIFIED
**Objective**: Verify auto-save works

**Steps**:
1. Open DevTools → Application → Local Storage
2. Check for key: "socialnet_graph_state"
3. Perform NFC tap to add connection
4. Check localStorage again

**Expected**:
- localStorage updated immediately
- JSON contains all connections
- Date serialized as ISO string

**Pass Criteria**: Auto-save triggers correctly

---

### Test 5.2: Load on Page Reload ✅ IMPROVED
**Objective**: Verify state restores on reload

**Steps**:
1. Add 2-3 NFC connections
2. Note connection count
3. Reload page (F5)
4. Check connection count

**Expected**:
- Same connection count after reload
- Connections appear in graph (when NetworkGraph integrated)
- No data loss

**Pass Criteria**: State fully restored

---

### Test 5.3: Empty localStorage
**Objective**: Verify fallback to default data

**Steps**:
1. Open DevTools → Application → Local Storage
2. Delete "socialnet_graph_state" key
3. Reload page
4. Check connection count

**Expected**:
- Default connections loaded from mockData.ts
- Count: 19 connections (initial state)
- No errors in console

**Pass Criteria**: Fallback works correctly

---

### Test 5.4: Corrupted localStorage ✅ IMPROVED
**Objective**: Verify error handling for corrupted data

**Steps**:
1. Open DevTools → Application → Local Storage
2. Manually edit "socialnet_graph_state" to invalid JSON:
   ```
   {invalid json here
   ```
3. Reload page
4. Check console and app state

**Expected**:
- No crash
- Falls back to default mockData
- Silent error handling (no console errors for user)
- App fully functional

**Pass Criteria**: Graceful fallback on corruption

---

### Test 5.5: Large Dataset (50+ Connections)
**Objective**: Verify localStorage handles large data

**Steps**:
1. Manually add many connections to localStorage
2. Reload page
3. Check performance and data integrity

**Expected**:
- All connections loaded correctly
- No quota exceeded errors
- Reasonable load time (< 1s)

**Pass Criteria**: Large datasets handled correctly

---

## Test Suite 6: Responsive Design

### Test 6.1: Mobile View (375px × 667px)
**Objective**: Verify mobile layout

**Steps**:
1. Open DevTools → Device Toolbar
2. Select iPhone SE or custom 375px width
3. Test all features

**Expected**:
- Header stacks vertically
- Search bar full width
- Modal full-screen (inset-x-4 bottom-4)
- FAB visible and accessible
- No horizontal scroll
- Text readable

**Pass Criteria**: Mobile layout works correctly

---

### Test 6.2: Tablet View (768px × 1024px)
**Objective**: Verify tablet layout

**Steps**:
1. Set viewport to 768px width (iPad)
2. Test all features

**Expected**:
- Header may stack or stay horizontal (md breakpoint)
- Modal card-style (80% width, centered)
- Comfortable spacing
- All features accessible

**Pass Criteria**: Tablet layout works correctly

---

### Test 6.3: Desktop View (1920px × 1080px)
**Objective**: Verify desktop layout

**Steps**:
1. Set viewport to full desktop width
2. Test all features

**Expected**:
- Header horizontal layout
- Modal max-width 600px, centered
- Search bar max-width (max-w-md)
- Proper use of whitespace
- Hover states visible

**Pass Criteria**: Desktop layout works correctly

---

### Test 6.4: Modal Responsive Behavior
**Objective**: Verify modal adapts to screen size

**Steps**:
1. Open business card modal
2. Resize browser from mobile → tablet → desktop
3. Observe modal repositioning

**Expected**:
- Mobile: slides from bottom (inset-x-4 bottom-4)
- Desktop: centered (top-1/2 left-1/2 transform)
- Smooth transition between breakpoints

**Pass Criteria**: Modal responsive correctly

---

## Test Suite 7: Accessibility

### Test 7.1: Keyboard Navigation ✅ IMPROVED
**Objective**: Verify keyboard-only usage

**Steps**:
1. Don't use mouse
2. Press Tab to navigate through:
   - "Back to My Network" button (if visible)
   - Search bar
   - "Open Sample Business Card" button
   - NFC FAB
3. Press Enter to activate buttons

**Expected**:
- All interactive elements reachable via Tab
- Focus outline visible (blue ring)
- Enter/Space activates buttons
- No keyboard traps

**Pass Criteria**: Full keyboard navigation works

---

### Test 7.2: Screen Reader Labels
**Objective**: Verify ARIA labels are present

**Steps**:
1. Inspect elements in DevTools
2. Check for ARIA attributes:
   - Search input: `aria-label="Search connections"` + `<label>` ✅
   - Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
   - Close buttons: `aria-label="Close modal"`
   - NFC FAB: `aria-label="Simulate NFC tap"`

**Expected**:
- All interactive elements have descriptive labels
- Modal semantics correct
- Screen reader can understand UI

**Pass Criteria**: All ARIA labels present

---

### Test 7.3: Color Contrast
**Objective**: Verify WCAG AA compliance

**Steps**:
1. Use browser extension (e.g., axe DevTools)
2. Check color contrast ratios
3. Focus on:
   - Body text (gray-600 on white)
   - Headings (gray-900 on white)
   - Buttons (white on blue-600)
   - Word counter (green-600, yellow-600, red-600)

**Expected**:
- All text passes WCAG AA (4.5:1 minimum)
- Interactive elements distinguishable
- Status indicators clear

**Pass Criteria**: No contrast violations

---

### Test 7.4: Focus Visible
**Objective**: Verify focus indicators are visible

**Steps**:
1. Tab through all elements
2. Check for visible focus ring

**Expected**:
- Blue focus ring (ring-2 ring-blue-500) visible on all elements
- Focus ring not cut off by overflow
- Clear indication of focused element

**Pass Criteria**: Focus always visible

---

## Test Suite 8: Integration

### Test 8.1: Search → Modal Flow
**Objective**: Verify search results can open modals

**Steps**:
1. Search for "Photography"
2. (When NetworkGraph integrated) Click highlighted node
3. Verify modal opens for correct user

**Expected**:
- Search highlights correct nodes
- Clicking node opens business card
- Modal shows correct user data

**Pass Criteria**: Search-to-modal flow works

---

### Test 8.2: Perspective Switch Flow
**Objective**: Verify full perspective switching

**Steps**:
1. Open modal for user-1
2. Click "View Their Network"
3. Check header shows "Viewing: Sarah Chen"
4. Click "Back to My Network"
5. Verify return to original view

**Expected**:
- Current user state updates
- Header reflects current perspective
- Back button appears/disappears correctly
- (NetworkGraph would recenter - placeholder)

**Pass Criteria**: Perspective switching state correct

---

### Test 8.3: NFC → Search Flow
**Objective**: Verify new connections are searchable

**Steps**:
1. Perform NFC tap to add connection
2. Note which user was connected
3. Search for that user's location/interest
4. Verify they appear in results

**Expected**:
- New connection immediately searchable
- Search index includes new user
- Result count accurate

**Pass Criteria**: New connections searchable

---

## Test Suite 9: Edge Cases

### Test 9.1: Rapid Typing in Search
**Objective**: Verify no lag or race conditions

**Steps**:
1. Type very quickly: "abcdefghijklmnop"
2. Observe search results and performance

**Expected**:
- No lag or stuttering
- Results update smoothly
- Final results match final query
- No race conditions (results for "abc" don't override "abcdefghijklmnop")

**Pass Criteria**: Fast typing handled correctly

---

### Test 9.2: Multiple Rapid NFC Taps
**Objective**: Verify animation doesn't break with rapid clicks

**Steps**:
1. Open NFC modal
2. Click tap button rapidly 5 times
3. Observe behavior

**Expected**:
- Button disabled during animation (disabled={isAnimating})
- Only one connection added per modal open
- No duplicate connections
- Animation completes properly

**Pass Criteria**: Rapid clicking handled

---

### Test 9.3: Special Characters in Search
**Objective**: Verify special characters don't break search

**Steps**:
1. Search for: `<script>alert('test')</script>`
2. Search for: `O'Brien` (user-10)
3. Search for: `@#$%`

**Expected**:
- No XSS vulnerability
- No JavaScript execution
- Apostrophes work correctly (finds Ryan O'Brien)
- No errors in console

**Pass Criteria**: Special characters handled safely

---

## Summary

**Total Test Cases**: 52
**Critical Tests**: 15
**Automated**: 0 (manual testing only)
**Estimated Testing Time**: 2-3 hours

**Priority Order**:
1. **Critical** (must pass): Tests 1.1, 2.1, 2.2, 4.5, 5.2, 5.4
2. **High** (should pass): All Suite 3, Suite 7
3. **Medium** (nice to have): Suite 6, Suite 9
4. **Low** (future): Suite 8 (requires NetworkGraph)

**Testing Checklist**:
- [ ] Suite 1: SearchBar (7 tests)
- [ ] Suite 2: Word Counter (7 tests)
- [ ] Suite 3: BusinessCardModal (7 tests)
- [ ] Suite 4: NFCSimulator (7 tests)
- [ ] Suite 5: localStorage (5 tests)
- [ ] Suite 6: Responsive (4 tests)
- [ ] Suite 7: Accessibility (4 tests)
- [ ] Suite 8: Integration (3 tests) - Partial
- [ ] Suite 9: Edge Cases (3 tests)

**Sign-off**: Test cases ready for execution. All critical fixes applied.
