// Test script for localStorage persistence logic
console.log('Testing localStorage Persistence Logic\n');

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = value;
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

const STORAGE_KEY = 'socialnet_graph_state';

// Simulate persistence functions
function saveGraphState(connections) {
  try {
    const serialized = JSON.stringify(connections);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    return false;
  }
}

function loadGraphState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized);

    // Convert date strings back to Date objects
    return parsed.map((conn) => ({
      ...conn,
      lastInteraction: new Date(conn.lastInteraction)
    }));
  } catch (error) {
    return null;
  }
}

// Test data
const mockConnections = [
  { userId1: 'user-0', userId2: 'user-1', strength: 95, interactionCount: 47, lastInteraction: new Date('2026-01-28') },
  { userId1: 'user-0', userId2: 'user-2', strength: 88, interactionCount: 38, lastInteraction: new Date('2026-01-30') },
];

const tests = [
  {
    name: 'Save and load connections',
    test: () => {
      saveGraphState(mockConnections);
      const loaded = loadGraphState();
      return loaded && loaded.length === 2 && loaded[0].userId1 === 'user-0';
    }
  },
  {
    name: 'Load with empty localStorage',
    test: () => {
      localStorage.clear();
      const loaded = loadGraphState();
      return loaded === null;
    }
  },
  {
    name: 'Load with corrupted JSON',
    test: () => {
      localStorage.setItem(STORAGE_KEY, '{invalid json');
      const loaded = loadGraphState();
      return loaded === null;
    }
  },
  {
    name: 'Date objects restored correctly',
    test: () => {
      localStorage.clear();
      saveGraphState(mockConnections);
      const loaded = loadGraphState();
      return loaded && loaded[0].lastInteraction instanceof Date;
    }
  },
  {
    name: 'Validate array check (App.tsx logic)',
    test: () => {
      localStorage.clear();
      saveGraphState(mockConnections);
      const saved = loadGraphState();
      // Simulate App.tsx validation
      const isValid = saved && Array.isArray(saved) && saved.length > 0;
      return isValid;
    }
  },
  {
    name: 'Validate empty array not used',
    test: () => {
      localStorage.clear();
      saveGraphState([]);
      const saved = loadGraphState();
      // Simulate App.tsx validation
      const isValid = saved && Array.isArray(saved) && saved.length > 0;
      return !isValid; // Should be false (empty array rejected)
    }
  },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    const result = test.test();
    if (result) {
      console.log(`✅ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${test.name}`);
    console.log(`   ${error.message}`);
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
process.exit(failed > 0 ? 1 : 0);
