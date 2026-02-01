// Test script for word counter logic
console.log('Testing Word Counter Logic\n');

// Simulate the word counter function from BusinessCardModal
function countWords(bio) {
  const trimmedBio = bio.trim();
  return trimmedBio ? trimmedBio.split(/\s+/).length : 0;
}

function getColor(wordCount) {
  if (wordCount >= 130 && wordCount <= 150) return 'yellow';
  if (wordCount > 150) return 'red';
  return 'green';
}

const tests = [
  { bio: '', expected: 0, expectedColor: 'green', name: 'Empty string' },
  { bio: '   ', expected: 0, expectedColor: 'green', name: 'Whitespace only' },
  { bio: 'Hello', expected: 1, expectedColor: 'green', name: 'Single word' },
  { bio: 'Hello    world    test', expected: 3, expectedColor: 'green', name: 'Multiple spaces' },
  { bio: 'word '.repeat(129).trim(), expected: 129, expectedColor: 'green', name: '129 words (green threshold)' },
  { bio: 'word '.repeat(130).trim(), expected: 130, expectedColor: 'yellow', name: '130 words (yellow threshold)' },
  { bio: 'word '.repeat(150).trim(), expected: 150, expectedColor: 'yellow', name: '150 words (yellow max)' },
  { bio: 'word '.repeat(151).trim(), expected: 151, expectedColor: 'red', name: '151 words (red threshold)' },
  { bio: 'word '.repeat(200).trim(), expected: 200, expectedColor: 'red', name: '200 words (over limit)' },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = countWords(test.bio);
  const color = getColor(result);
  const wordPass = result === test.expected;
  const colorPass = color === test.expectedColor;
  const pass = wordPass && colorPass;

  if (pass) {
    console.log(`✅ PASS: ${test.name}`);
    console.log(`   Expected: ${test.expected} words (${test.expectedColor}), Got: ${result} words (${color})\n`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.name}`);
    console.log(`   Expected: ${test.expected} words (${test.expectedColor}), Got: ${result} words (${color})\n`);
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
process.exit(failed > 0 ? 1 : 0);
