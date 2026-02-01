// Test script for NFC tap logic
console.log('Testing NFC Tap Logic\n');

const CURRENT_USER_ID = 'user-0';

const mockUsers = [
  { id: 'user-0', name: 'You' },
  { id: 'user-1', name: 'Sarah Chen' },
  { id: 'user-2', name: 'Marcus Johnson' },
  { id: 'user-3', name: 'Emily Rodriguez' },
];

// Simulate the NFC tap logic from App.tsx
function simulateNFCTap(allUsers, connections) {
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
    return { success: false, message: 'Already connected to everyone' };
  }

  const randomUser = unconnectedUsers[Math.floor(Math.random() * unconnectedUsers.length)];
  const randomStrength = Math.floor(Math.random() * 40) + 30; // 30-70 strength

  const newConnection = {
    userId1: CURRENT_USER_ID,
    userId2: randomUser.id,
    strength: randomStrength,
    interactionCount: 1,
    lastInteraction: new Date()
  };

  return { success: true, connection: newConnection };
}

const tests = [
  {
    name: 'Add first connection',
    test: () => {
      const connections = [];
      const result = simulateNFCTap(mockUsers, connections);
      return result.success &&
             result.connection.userId1 === CURRENT_USER_ID &&
             result.connection.strength >= 30 &&
             result.connection.strength <= 70 &&
             result.connection.interactionCount === 1;
    }
  },
  {
    name: 'Add second connection (different user)',
    test: () => {
      const connections = [
        { userId1: 'user-0', userId2: 'user-1', strength: 50, interactionCount: 1, lastInteraction: new Date() }
      ];
      const result = simulateNFCTap(mockUsers, connections);
      return result.success && result.connection.userId2 !== 'user-1';
    }
  },
  {
    name: 'No unconnected users left',
    test: () => {
      const connections = [
        { userId1: 'user-0', userId2: 'user-1', strength: 50, interactionCount: 1, lastInteraction: new Date() },
        { userId1: 'user-0', userId2: 'user-2', strength: 60, interactionCount: 1, lastInteraction: new Date() },
        { userId1: 'user-0', userId2: 'user-3', strength: 70, interactionCount: 1, lastInteraction: new Date() },
      ];
      const result = simulateNFCTap(mockUsers, connections);
      return !result.success && result.message === 'Already connected to everyone';
    }
  },
  {
    name: 'Strength is in valid range',
    test: () => {
      const connections = [];
      const result = simulateNFCTap(mockUsers, connections);
      return result.success &&
             result.connection.strength >= 30 &&
             result.connection.strength < 70; // Should be 30-69 (Math.floor)
    }
  },
  {
    name: 'Bidirectional connection check',
    test: () => {
      // Connection stored as user-1 -> user-0 (reversed)
      const connections = [
        { userId1: 'user-1', userId2: 'user-0', strength: 50, interactionCount: 1, lastInteraction: new Date() }
      ];
      const result = simulateNFCTap(mockUsers, connections);
      // Should not connect to user-1 again
      return result.success && result.connection.userId2 !== 'user-1';
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
