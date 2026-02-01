// Master test runner
import { execSync } from 'child_process';

console.log('========================================');
console.log('Running All UI Features Tests');
console.log('========================================\n');

const tests = [
  { name: 'Word Counter Logic', file: 'test-word-counter.js' },
  { name: 'localStorage Persistence', file: 'test-persistence.js' },
  { name: 'Search Functionality', file: 'test-search.js' },
  { name: 'NFC Tap Logic', file: 'test-nfc.js' },
];

let totalPassed = 0;
let totalFailed = 0;

tests.forEach((test, index) => {
  console.log(`\n[${index + 1}/${tests.length}] Running: ${test.name}`);
  console.log('----------------------------------------');

  try {
    const output = execSync(`node ${test.file}`, { encoding: 'utf8' });
    console.log(output);

    // Count results
    const match = output.match(/Results: (\d+) passed, (\d+) failed/);
    if (match) {
      totalPassed += parseInt(match[1]);
      totalFailed += parseInt(match[2]);
    }
  } catch (error) {
    console.error(`❌ Test suite failed: ${test.name}`);
    console.error(error.stdout || error.message);
    totalFailed++;
  }
});

console.log('\n========================================');
console.log('FINAL RESULTS');
console.log('========================================');
console.log(`Total Tests Passed: ${totalPassed}`);
console.log(`Total Tests Failed: ${totalFailed}`);
console.log(`Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);

if (totalFailed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉');
  process.exit(0);
} else {
  console.log('\n⚠️  SOME TESTS FAILED');
  process.exit(1);
}
