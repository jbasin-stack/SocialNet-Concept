// Test script for search functionality
import Fuse from 'fuse.js';

console.log('Testing Search Functionality (Fuse.js)\n');

// Mock user data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    profile: {
      interests: ['Photography', 'Coffee', 'Web Development'],
      location: 'San Francisco, CA',
      industry: 'Tech'
    }
  },
  {
    id: 'user-2',
    name: 'Marcus Johnson',
    profile: {
      interests: ['Running', 'Cooking', 'User Research'],
      location: 'Oakland, CA',
      industry: 'Tech'
    }
  },
  {
    id: 'user-3',
    name: 'Lisa Patel',
    profile: {
      interests: ['Healthcare', 'Yoga', 'Wellness'],
      location: 'Austin, TX',
      industry: 'Healthcare'
    }
  },
  {
    id: 'user-4',
    name: "Ryan O'Brien",
    profile: {
      interests: ['Golf', 'Wine', 'Networking'],
      location: 'Chicago, IL',
      industry: 'Retail'
    }
  }
];

// Configure Fuse.js (same as SearchBar component)
const fuse = new Fuse(mockUsers, {
  keys: [
    'profile.interests',
    'profile.location',
    'profile.industry',
    'name'
  ],
  threshold: 0.3,
  includeScore: true
});

function search(query) {
  if (!query.trim()) return [];
  const results = fuse.search(query);
  return results.map(r => r.item.id);
}

const tests = [
  {
    name: 'Search by location (exact)',
    query: 'San Francisco',
    expected: ['user-1'],
  },
  {
    name: 'Search by location (partial)',
    query: 'San',
    expected: ['user-1'],
  },
  {
    name: 'Search by interest',
    query: 'Photography',
    expected: ['user-1'],
  },
  {
    name: 'Search by industry',
    query: 'Healthcare',
    expected: ['user-3'],
  },
  {
    name: 'Search by name',
    query: 'Sarah',
    expected: ['user-1'],
  },
  {
    name: 'Fuzzy search (typo)',
    query: 'photografy',
    expected: ['user-1'],
  },
  {
    name: 'Empty search',
    query: '',
    expected: [],
  },
  {
    name: 'Special character (apostrophe)',
    query: "O'Brien",
    expected: ['user-4'],
  },
  {
    name: 'No matches',
    query: 'zzzzzzz',
    expected: [],
  },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const results = search(test.query);

  // Check if all expected IDs are in results
  const hasAllExpected = test.expected.every(id => results.includes(id));
  // Check if results only contain expected IDs
  const onlyExpected = results.every(id => test.expected.includes(id));

  const pass = hasAllExpected && onlyExpected;

  if (pass) {
    console.log(`✅ PASS: ${test.name}`);
    console.log(`   Query: "${test.query}" -> Found: ${results.length} result(s)\n`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.name}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Expected: [${test.expected.join(', ')}]`);
    console.log(`   Got: [${results.join(', ')}]\n`);
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
process.exit(failed > 0 ? 1 : 0);
