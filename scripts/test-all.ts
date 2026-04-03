/**
 * Run tests for all packages
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const packages = [
  'packages/client',
  'packages/server-node',
];

console.log('🧪 Running all tests...\n');

let failed = false;

for (const pkg of packages) {
  const pkgPath = resolve(process.cwd(), pkg);

  if (!existsSync(pkgPath)) {
    console.log(`⚠️  Skipping ${pkg} (not found)`);
    continue;
  }

  console.log(`🔬 Testing ${pkg}...`);

  try {
    execSync('npm test', {
      cwd: pkgPath,
      stdio: 'inherit',
    });
    console.log(`✅ ${pkg} tests passed\n`);
  } catch (error) {
    console.error(`❌ ${pkg} tests failed\n`);
    failed = true;
  }
}

if (failed) {
  console.error('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✨ All tests passed!');
}
