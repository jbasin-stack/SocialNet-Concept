# UI Features Implementation Plan

## Step 0: Query context7 MCP for Design System

Before building any components, query context7 MCP for design guidance:

```
Query 1: "Modern, friendly social network design system with color palette"
Query 2: "Typography scale and font pairings for React social app"
Query 3: "8px grid spacing system for Tailwind CSS"
Query 4: "Modal and button animation timing and easing functions"
Query 5: "Business card modal layout best practices"
Query 6: "Search bar with live filtering UX patterns"
Query 7: "Floating action button design and positioning"
Query 8: "Mobile-first responsive breakpoints"
```

Document the responses and use them throughout implementation.

## Step 1: Create BusinessCardModal Component

**File**: `src/components/BusinessCardModal/BusinessCardModal.tsx`

```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';

interface BusinessCardModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onViewNetwork: (userId: string) => void;
}

export default function BusinessCardModal({
  user,
  isOpen,
  onClose,
  onViewNetwork
}: BusinessCardModalProps) {
  if (!user) return null;

  // Calculate word count
  const wordCount = user.profile.bio.trim().split(/\s+/).length;

  // Color based on word count
  let countColor = 'text-green-600';
  if (wordCount >= 130 && wordCount <= 150) countColor = 'text-yellow-600';
  if (wordCount > 150) countColor = 'text-red-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{user.profile.location}</p>
                  <p className="text-sm text-gray-500">{user.profile.industry}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Bio */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600">{user.profile.bio}</p>
                <p className={`text-xs mt-1 ${countColor}`}>
                  {wordCount} / 150 words
                </p>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Fun Fact</h3>
                <p className="text-gray-600 italic">{user.profile.funFact}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  onViewNetwork(user.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Their Network
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Step 2: Create SearchBar Component

**File**: `src/components/SearchBar/SearchBar.tsx`

```typescript
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { User } from '../../types';

interface SearchBarProps {
  users: User[];
  onSearchResults: (matchedIds: string[]) => void;
}

export default function SearchBar({ users, onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);

  // Configure Fuse.js
  const fuse = new Fuse(users, {
    keys: [
      'profile.interests',
      'profile.location',
      'profile.industry',
      'name'
    ],
    threshold: 0.3,
    includeScore: true
  });

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      onSearchResults([]);
      setResultCount(0);
      return;
    }

    const results = fuse.search(query);
    const matchedIds = results.map(r => r.item.id);

    onSearchResults(matchedIds);
    setResultCount(matchedIds.length);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
    setResultCount(0);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by interest, location, or industry..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search connections"
        />

        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Result Count */}
      {query && (
        <p className="mt-2 text-sm text-gray-600">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} found
        </p>
      )}
    </div>
  );
}
```

## Step 3: Create NFCSimulator Component

**File**: `src/components/NFCSimulator/NFCSimulator.tsx`

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NFCSimulatorProps {
  onTap: () => void;
}

export default function NFCSimulator({ onTap }: NFCSimulatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleTap = () => {
    setIsAnimating(true);
    onTap();

    // Reset animation
    setTimeout(() => {
      setIsAnimating(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-3xl z-30"
        aria-label="Simulate NFC tap"
      >
        📱
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-8 z-50 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">NFC Connection</h2>
              <p className="text-gray-600 mb-6">Tap to simulate a new connection</p>

              {/* Tap Button with Ripple Animation */}
              <motion.button
                onClick={handleTap}
                disabled={isAnimating}
                animate={isAnimating ? {
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    '0 0 0 40px rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{ duration: 0.8, repeat: isAnimating ? Infinity : 0 }}
                className="w-24 h-24 bg-blue-600 text-white rounded-full text-4xl hover:bg-blue-700 disabled:opacity-50 mx-auto"
              >
                {isAnimating ? '✓' : '👋'}
              </motion.button>

              {isAnimating && (
                <p className="mt-4 text-green-600 font-semibold">Connection added!</p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

## Step 4: Update App.tsx with All Components

**File**: `src/App.tsx` (Complete Integration)

```typescript
import { useState, useEffect } from 'react';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import BusinessCardModal from './components/BusinessCardModal/BusinessCardModal';
import SearchBar from './components/SearchBar/SearchBar';
import NFCSimulator from './components/NFCSimulator/NFCSimulator';
import { User, Connection } from './types';
import { allUsers, connections as initialConnections, CURRENT_USER_ID } from './data/mockData';
import { saveGraphState, loadGraphState } from './utils/persistence';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);

  // Load connections from localStorage on mount
  useEffect(() => {
    const saved = loadGraphState();
    if (saved) {
      setConnections(saved);
    }
  }, []);

  // Save connections to localStorage when they change
  useEffect(() => {
    saveGraphState(connections);
  }, [connections]);

  const handleNodeClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleViewNetwork = (userId: string) => {
    setCurrentUserId(userId);
    setSelectedUser(null);
  };

  const handleBackToMyNetwork = () => {
    setCurrentUserId(CURRENT_USER_ID);
    setSelectedUser(null);
  };

  const handleSearchResults = (matchedIds: string[]) => {
    setHighlightedNodeIds(matchedIds);
  };

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
    const randomStrength = Math.floor(Math.random() * 40) + 30; // 30-70 strength

    const newConnection: Connection = {
      userId1: CURRENT_USER_ID,
      userId2: randomUser.id,
      strength: randomStrength,
      interactionCount: 1,
      lastInteraction: new Date()
    };

    setConnections([...connections, newConnection]);
  };

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SocialNet POC</h1>
              {currentUserId !== CURRENT_USER_ID && (
                <button
                  onClick={handleBackToMyNetwork}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  ← Back to My Network
                </button>
              )}
            </div>
            <SearchBar users={allUsers} onSearchResults={handleSearchResults} />
          </div>
        </div>
      </div>

      {/* Network Graph */}
      <div className="pt-24 md:pt-20">
        <NetworkGraph
          currentUserId={currentUserId}
          onNodeClick={handleNodeClick}
          highlightedNodeIds={highlightedNodeIds}
        />
      </div>

      {/* Business Card Modal */}
      <BusinessCardModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onViewNetwork={handleViewNetwork}
      />

      {/* NFC Simulator */}
      <NFCSimulator onTap={handleNFCTap} />
    </div>
  );
}

export default App;
```

## Step 5: Add Word Counter Utility (Optional Standalone)

**File**: `src/utils/wordCounter.ts`

```typescript
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function getWordCountColor(count: number): string {
  if (count < 130) return 'text-green-600';
  if (count <= 150) return 'text-yellow-600';
  return 'text-red-600';
}
```

## Step 6: Test All Features

Run the dev server:
```bash
npm run dev
```

### Test Checklist

**BusinessCardModal**:
- [ ] Click any node → modal opens
- [ ] Shows correct user info
- [ ] Word counter displays and color-codes correctly
- [ ] "View Their Network" button recenters graph
- [ ] "Close" button closes modal
- [ ] Escape key closes modal
- [ ] Animation is smooth

**SearchBar**:
- [ ] Type "photography" → highlights matching users
- [ ] Result count is accurate
- [ ] Clear button clears search
- [ ] Non-matches stay gray
- [ ] Works with partial matches

**NFCSimulator**:
- [ ] Floating button visible bottom-right
- [ ] Click opens modal
- [ ] "Tap" button adds connection
- [ ] New connection appears in graph
- [ ] Success message shows
- [ ] Connection saved (refresh page, still there)

**Responsive**:
- [ ] Mobile: modals full-screen
- [ ] Tablet: modals card-style
- [ ] Desktop: modals centered
- [ ] Search bar fits on all devices

## Files Created

```
src/
├── components/
│   ├── BusinessCardModal/
│   │   └── BusinessCardModal.tsx
│   ├── SearchBar/
│   │   └── SearchBar.tsx
│   └── NFCSimulator/
│       └── NFCSimulator.tsx
├── utils/
│   └── wordCounter.ts (optional)
└── App.tsx (MODIFIED)
```

## Success Criteria

- ✅ All components built and styled
- ✅ context7 MCP design system applied
- ✅ Framer Motion animations working
- ✅ Search filtering accurate
- ✅ NFC simulator adds connections
- ✅ Word counter enforces limit
- ✅ Responsive on all devices
- ✅ Accessible (keyboard, ARIA)
- ✅ No errors or warnings

**POC COMPLETE!** 🎉
