# UI Features Agent - Instructions

## Role
Create user generator, fix NFC bug, update App layout, and apply design system styling to all UI components.

## Dependencies
⚠️ **WAIT FOR DESIGN SYSTEM AGENT TO COMPLETE FIRST**

You need:
- Tailwind theme from `tailwind.config.js` (primary-500, neutral-*, etc.)
- CSS variable --header-height from `index.css`

**Do not start until Design System Agent confirms completion.**

**You can work in parallel with Visualization Agent** - you don't touch NetworkGraph.tsx, they don't touch your files.

---

## Part 1: Create User Generator (NEW FILE)

### File: `C:\Claude code projects\SocialNet_Concept\src\utils\userGenerator.ts`

**Action:** Create new file with this content:

```typescript
import { User } from '../types';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Sage',
  'Avery', 'Blake', 'Cameron', 'Dakota', 'Eden', 'Finley', 'Harper', 'Hayden'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez',
  'Davis', 'Rodriguez', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'
];

const INTERESTS_POOL = [
  'Photography', 'Hiking', 'Cooking', 'Reading', 'Music', 'Travel',
  'Gaming', 'Fitness', 'Art', 'Technology', 'Writing', 'Dancing',
  'Cycling', 'Swimming', 'Yoga', 'Meditation', 'Gardening', 'Coffee'
];

const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
];

const INDUSTRIES = [
  'Tech', 'Healthcare', 'Finance', 'Creative', 'Education',
  'Marketing', 'Retail', 'Manufacturing', 'Hospitality', 'Media'
];

const BIO_TEMPLATES = [
  'Building innovative solutions and connecting with like-minded professionals.',
  'Passionate about creating meaningful experiences through my work.',
  'Explorer of ideas, connector of people, maker of things.',
  'Dedicated professional focused on growth and collaboration.',
  'Lifelong learner sharing knowledge and building community.'
];

const FUN_FACTS = [
  'I once backpacked through 15 countries in one year!',
  'I can solve a Rubik\'s cube in under 2 minutes.',
  'I have a collection of over 100 vinyl records.',
  'I volunteer at the local animal shelter every weekend.',
  'I speak three languages fluently!'
];

export function generateUser(id: string): User {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  // Generate 2-4 random interests
  const interestCount = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...INTERESTS_POOL].sort(() => 0.5 - Math.random());
  const interests = shuffled.slice(0, interestCount);

  return {
    id,
    name: `${firstName} ${lastName}`,
    profile: {
      bio: BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)],
      interests,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      funFact: FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)],
      industry: INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]
    }
  };
}

export function getNextUserId(existingUsers: User[]): string {
  const maxId = existingUsers.reduce((max, user) => {
    const match = user.id.match(/user-(\d+)/);
    if (match) {
      return Math.max(max, parseInt(match[1], 10));
    }
    return max;
  }, -1);

  return `user-${maxId + 1}`;
}
```

**Why:** Generates realistic users dynamically to fix NFC "already connected" bug.

---

## Part 2: Update App.tsx

### File: `C:\Claude code projects\SocialNet_Concept\src\App.tsx`

You will make 4 changes to this file:

---

### Change 2.1: Add Import

**Location:** Top of file (after other imports)

**Add:**
```tsx
import { generateUser, getNextUserId } from './utils/userGenerator';
```

---

### Change 2.2: Add Users State

**Location:** Around lines 12-15 (where state is declared)

**Find:**
```tsx
const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [connections, setConnections] = useState<Connection[]>(initialConnections);
const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
```

**Add after:**
```tsx
const [users, setUsers] = useState<User[]>(allUsers);
```

---

### Change 2.3: Replace handleNFCTap Function

**Location:** Around lines 52-81

**Find:**
```tsx
const handleNFCTap = () => {
  // Create a random new connection
  const unconnectedUsers = allUsers.filter(
    user =>
      user.id !== CURRENT_USER_ID &&
      !connections.some(
        conn =>
          (conn.userId1 === CURRENT_USER_ID && conn.userId2 === user.id) ||
          (conn.userId2 === CURRENT_USER_ID && conn.userId1 === user.id)
      )
  );

  if (unconnectedUsers.length === 0) {
    alert('You are already connected to everyone!');
    return;
  }

  const randomUser = unconnectedUsers[Math.floor(Math.random() * unconnectedUsers.length)];
  const randomStrength = Math.floor(Math.random() * 40) + 30; // 30-70

  const newConnection: Connection = {
    userId1: CURRENT_USER_ID,
    userId2: randomUser.id,
    strength: randomStrength,
    interactionCount: 1,
    lastInteraction: new Date()
  };

  setConnections([...connections, newConnection]);
};
```

**Replace With:**
```tsx
const handleNFCTap = () => {
  // Check for unconnected users
  const unconnectedUsers = users.filter(
    user =>
      user.id !== CURRENT_USER_ID &&
      !connections.some(
        conn =>
          (conn.userId1 === CURRENT_USER_ID && conn.userId2 === user.id) ||
          (conn.userId2 === CURRENT_USER_ID && conn.userId1 === user.id)
      )
  );

  let newUser: User;

  // If everyone is connected, generate a new user
  if (unconnectedUsers.length === 0) {
    const newUserId = getNextUserId(users);
    newUser = generateUser(newUserId);
    setUsers([...users, newUser]);
  } else {
    // Pick random unconnected user
    newUser = unconnectedUsers[Math.floor(Math.random() * unconnectedUsers.length)];
  }

  // Create connection with random strength (30-70)
  const randomStrength = Math.floor(Math.random() * 40) + 30;
  const newConnection: Connection = {
    userId1: CURRENT_USER_ID,
    userId2: newUser.id,
    strength: randomStrength,
    interactionCount: 1,
    lastInteraction: new Date()
  };

  setConnections([...connections, newConnection]);
};
```

**Why:** Generates new users instead of showing alert. Fixes NFC bug.

---

### Change 2.4: Update Component Props to Use `users` State

**Find line ~106:**
```tsx
<SearchBar users={allUsers} onSearchResults={handleSearchResults} />
```

**Replace With:**
```tsx
<SearchBar users={users} onSearchResults={handleSearchResults} />
```

**Find line ~115:**
```tsx
<NetworkGraph
  users={allUsers}
  // ... other props
/>
```

**Replace With:**
```tsx
<NetworkGraph
  users={users}
  // ... other props
/>
```

**Why:** Use dynamic users array instead of static allUsers.

---

### Change 2.5: Update Layout & Styling

**Find line ~87:**
```tsx
<div className="relative w-full h-screen bg-gray-50">
```

**Replace With:**
```tsx
<div className="relative w-full h-screen overflow-hidden bg-surface">
```

**Find line ~89:**
```tsx
<div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm">
```

**Replace With:**
```tsx
<div className="absolute top-0 left-0 right-0 z-header bg-surface-elevated shadow-subtle">
```

**Find line ~91:**
```tsx
<div className="max-w-7xl mx-auto px-4 py-4">
```

**Replace With:**
```tsx
<div className="max-w-7xl mx-auto px-6 py-6">
```

**Find line ~93:**
```tsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
```

**Keep this, but update children:**

**Find line ~95 (heading):**
```tsx
<h1 className="text-2xl font-bold text-gray-800">
  SocialNet POC
</h1>
```

**Replace With:**
```tsx
<h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
  SocialNet POC
</h1>
```

**Find line ~96 (subtitle):**
```tsx
<p className="text-sm text-gray-600 mt-1">
  Viewing: <span className="font-medium text-gray-900">{currentUser?.name || 'Unknown'}</span>
</p>
```

**Replace With:**
```tsx
<p className="text-sm text-neutral-600 mt-1">
  Viewing: <span className="font-medium text-neutral-900">{currentUser?.name || 'Unknown'}</span>
</p>
```

**Find "Back to My Network" button (around line ~100):**
```tsx
<button
  onClick={handleBackToMyNetwork}
  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
>
  ← Back to My Network
</button>
```

**Replace With:**
```tsx
<button
  onClick={handleBackToMyNetwork}
  className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:scale-95 transition-all duration-150 text-sm font-medium shadow-sm"
>
  ← Back to My Network
</button>
```

**Find line ~112 (graph container):**
```tsx
<div className="pt-32 md:pt-28 h-full">
```

**Replace With:**
```tsx
<div className="h-full" style={{ paddingTop: '104px' }}>
```

**Why:** Apply Johnny Ives design system, fix layout spacing.

---

## Part 3: Update SearchBar.tsx

### File: `C:\Claude code projects\SocialNet_Concept\src\components\SearchBar\SearchBar.tsx`

**Find input field (around line ~59):**
```tsx
className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
```

**Replace With:**
```tsx
className="w-full px-4 py-2 pl-10 pr-10 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-neutral-900 placeholder:text-neutral-400"
```

**Find search icon (around line ~65):**
```tsx
className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
```

**Replace With:**
```tsx
className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
```

**Find clear button (around line ~77):**
```tsx
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
```

**Replace With:**
```tsx
className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
```

**Find result count (around line ~89):**
```tsx
className="mt-2 text-sm text-gray-600"
```

**Replace With:**
```tsx
className="mt-2 text-sm text-neutral-600 font-medium"
```

**Why:** Consistent design system colors.

---

## Part 4: Update BusinessCardModal.tsx

### File: `C:\Claude code projects\SocialNet_Concept\src\components\BusinessCardModal\BusinessCardModal.tsx`

**Find backdrop (around line ~51):**
```tsx
className="fixed inset-0 bg-black bg-opacity-50 z-40"
```

**Replace With:**
```tsx
className="fixed inset-0 bg-black/50 z-modal-backdrop"
```

**Find modal container (around line ~61):**
```tsx
className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full"
```

**Replace With:**
```tsx
className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-surface-elevated rounded-2xl shadow-elevated z-modal max-w-2xl w-full overflow-hidden"
```

**Find user name heading (around line ~73):**
```tsx
<h2 id="modal-title" className="text-2xl font-bold text-gray-900">
  {user.name}
</h2>
```

**Replace With:**
```tsx
<h2 id="modal-title" className="text-2xl font-semibold text-neutral-900 tracking-tight">
  {user.name}
</h2>
```

**Find location/industry text (around lines ~75-76):**
```tsx
<p className="text-sm text-gray-500 mt-1">{user.profile.location}</p>
<p className="text-sm text-gray-500">{user.profile.industry}</p>
```

**Replace With:**
```tsx
<p className="text-sm text-neutral-500 mt-1">{user.profile.location}</p>
<p className="text-sm text-neutral-500">{user.profile.industry}</p>
```

**Find close button (around line ~80):**
```tsx
className="text-gray-400 hover:text-gray-600 transition p-1 rounded-md hover:bg-gray-100"
```

**Replace With:**
```tsx
className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg hover:bg-neutral-100"
```

**Find "Bio" heading (around line ~95):**
```tsx
<h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Bio</h3>
```

**Replace With:**
```tsx
<h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Bio</h3>
```

**Find bio text (around line ~96):**
```tsx
<p className="text-gray-700 leading-relaxed">{user.profile.bio}</p>
```

**Replace With:**
```tsx
<p className="text-neutral-900 leading-relaxed">{user.profile.bio}</p>
```

**Find word count (around line ~98):**
```tsx
<p className={`text-xs mt-2 ${wordCount > 150 ? 'text-red-500' : wordCount >= 130 ? 'text-yellow-600' : 'text-gray-400'}`}>
```

**Replace With:**
```tsx
<p className={`text-xs mt-2 font-medium ${wordCount > 150 ? 'text-error' : wordCount >= 130 ? 'text-warning' : 'text-neutral-400'}`}>
```

**Find interest tags (around line ~107):**
```tsx
<span
  key={idx}
  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
>
```

**Replace With:**
```tsx
<span
  key={idx}
  className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
>
```

**Find "View Their Network" button (around line ~127):**
```tsx
className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
```

**Replace With:**
```tsx
className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:scale-98 transition-all duration-150 font-medium shadow-sm"
```

**Find "Close" button (around line ~134):**
```tsx
className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium"
```

**Replace With:**
```tsx
className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 active:scale-98 transition-all duration-150 font-medium"
```

**Why:** Apple-inspired modal design with refined colors and spacing.

---

## Part 5: Update NFCSimulator.tsx

### File: `C:\Claude code projects\SocialNet_Concept\src\components\NFCSimulator\NFCSimulator.tsx`

**Find FAB button (around line ~30):**
```tsx
className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition flex items-center justify-center text-3xl z-10"
```

**Replace With:**
```tsx
className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-600 active:scale-95 flex items-center justify-center text-3xl z-header transition-all duration-200"
```

**Find modal backdrop (around line ~47):**
```tsx
className="fixed inset-0 bg-black bg-opacity-50 z-40"
```

**Replace With:**
```tsx
className="fixed inset-0 bg-black/50 z-modal-backdrop"
```

**Find modal container (around line ~54):**
```tsx
className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-8 z-50 text-center max-w-sm w-full mx-4"
```

**Replace With:**
```tsx
className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-elevated rounded-2xl shadow-elevated p-8 z-modal text-center max-w-sm w-full mx-4"
```

**Find modal title (around line ~59):**
```tsx
<h2 id="nfc-modal-title" className="text-2xl font-bold text-gray-900 mb-4">
```

**Replace With:**
```tsx
<h2 id="nfc-modal-title" className="text-2xl font-semibold text-neutral-900 tracking-tight mb-4">
```

**Find instruction text (around line ~62):**
```tsx
<p className="text-gray-600 mb-6">Tap to simulate an NFC connection</p>
```

**Replace With:**
```tsx
<p className="text-neutral-600 mb-6">Tap to simulate an NFC connection</p>
```

**Find tap button (around line ~77):**
```tsx
className="w-24 h-24 bg-blue-600 text-white rounded-full text-4xl hover:bg-blue-700 disabled:opacity-50 mx-auto transition"
```

**Replace With:**
```tsx
className="w-24 h-24 bg-primary-500 text-white rounded-full text-4xl hover:bg-primary-600 disabled:opacity-50 mx-auto transition-all duration-200 shadow-md active:scale-95"
```

**Find success message (around line ~87):**
```tsx
className="mt-4 text-green-600 font-semibold"
```

**Replace With:**
```tsx
className="mt-4 text-success font-semibold animate-fade-in"
```

**Find cancel button (around line ~96):**
```tsx
className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
```

**Replace With:**
```tsx
className="mt-6 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors font-medium"
```

**Why:** Consistent buttons and modal styling.

---

## Verification Checklist

After making all changes:

### New File Created
- ✅ `src/utils/userGenerator.ts` exists with generateUser and getNextUserId functions

### App.tsx Updates
- ✅ Import for userGenerator added
- ✅ users state declared
- ✅ handleNFCTap generates new users when all connected
- ✅ SearchBar and NetworkGraph use `users` prop (not `allUsers`)
- ✅ Layout uses design system classes (bg-surface, text-neutral-*, etc.)
- ✅ Graph container uses inline style paddingTop: '104px'
- ✅ Button uses bg-primary-500

### Component Styling
- ✅ SearchBar uses neutral-* and primary-500 colors
- ✅ BusinessCardModal uses surface-elevated, rounded-2xl, shadow-elevated
- ✅ Interest tags use bg-primary-50 text-primary-700
- ✅ NFCSimulator FAB uses bg-primary-500
- ✅ All z-index uses tokens (z-header, z-modal, z-modal-backdrop)

## Testing

1. Run `npm run dev`
2. Open browser
3. **Layout Test:** No weird padding, graph fills screen
4. **NFC Test:**
   - Click phone emoji button
   - Tap "Tap to Connect" 10+ times
   - Should generate user-20, user-21, user-22, etc.
   - Should NEVER show "already connected" alert
5. **Design Test:**
   - Colors should feel Apple-like (clean blue, warm grays)
   - Buttons should have smooth hover (scale effect)
   - Modals should have generous rounded corners

## Estimated Time
40-50 minutes

## Can Work in Parallel With
**Visualization Agent** - They only touch NetworkGraph.tsx, you don't touch it.

## Handoff Signal
When done, confirm: "UI Features Agent Complete - NFC bug fixed, design system applied"
