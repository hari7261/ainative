/**
 * Run tests for all packages
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const packages = [
  'packages/client',
  'packages/server-node',
  'packages/cli',
];

console.log('Running all tests...\n');

let failed = false;

for (const pkg of packages) {
  const pkgPath = resolve(process.cwd(), pkg);

  if (!existsSync(pkgPath)) {
    console.log(`Skipping ${pkg} (not found)`);
    continue;
  }

  const packageJsonPath = resolve(pkgPath, 'package.json');
  const packageJson = existsSync(packageJsonPath)
    ? JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    : null;
  const hasTestScript = packageJson?.scripts?.test;

  if (!hasTestScript) {
    console.log(`Skipping ${pkg} (no test script)\n`);
    continue;
  }

  console.log(`Testing ${pkg}...`);

  try {
    execSync(`corepack pnpm --dir "${pkgPath}" test`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    console.log(`${pkg} tests passed\n`);
  } catch (error) {
    console.error(`${pkg} tests failed\n`);
    failed = true;
  }
}

const pythonTestPath = resolve(process.cwd(), 'packages/server-python/tests/test_server.py');
if (existsSync(pythonTestPath)) {
  console.log('Testing packages/server-python...');

  try {
    execSync('python -m pytest tests/test_server.py', {
      cwd: resolve(process.cwd(), 'packages/server-python'),
      env: {
        ...process.env,
        PYTEST_DISABLE_PLUGIN_AUTOLOAD: '1',
      },
      stdio: 'inherit',
    });
    console.log('packages/server-python tests passed\n');
  } catch (error) {
    console.error('packages/server-python tests failed\n');
    failed = true;
  }
}

if (failed) {
  console.error('Some tests failed');
  process.exit(1);
} else {
  console.log('All tests passed!');
}
