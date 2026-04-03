/**
 * Release script using changesets
 */

import { execSync } from 'child_process';

console.log('📦 Publishing packages...\n');

try {
  // Build all packages
  console.log('Building packages...');
  execSync('npm run build', { stdio: 'inherit' });

  // Run tests
  console.log('\nRunning tests...');
  execSync('npm test', { stdio: 'inherit' });

  // Publish with changesets
  console.log('\nPublishing...');
  execSync('npx changeset publish', { stdio: 'inherit' });

  console.log('\n✨ Release complete!');
} catch (error) {
  console.error('\n❌ Release failed');
  process.exit(1);
}
