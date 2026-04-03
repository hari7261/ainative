/**
 * Build all packages
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const packages = [
  'packages/client',
  'packages/server-node',
  'packages/cli',
];

console.log('Building all packages...\n');

for (const pkg of packages) {
  const pkgPath = resolve(process.cwd(), pkg);

  if (!existsSync(pkgPath)) {
    console.log(`Skipping ${pkg} (not found)`);
    continue;
  }

  console.log(`Building ${pkg}...`);

  try {
    execSync(`corepack pnpm --dir "${pkgPath}" run build`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    console.log(`${pkg} built successfully\n`);
  } catch (error) {
    console.error(`Failed to build ${pkg}\n`);
    process.exit(1);
  }
}

console.log('All packages built successfully!');
