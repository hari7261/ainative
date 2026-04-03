import { execSync } from 'child_process';
import chalk from 'chalk';

export async function doctorCommand() {
  console.log(chalk.blue.bold('\n🔍 AINative Doctor\n'));

  const checks = [
    { name: 'Node.js', command: 'node --version', required: '>=18.0.0' },
    { name: 'npm', command: 'npm --version', required: '>=8.0.0' },
    { name: 'Git', command: 'git --version', required: '>=2.0.0' },
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      const version = execSync(check.command, { encoding: 'utf-8' }).trim();
      console.log(chalk.green('✓'), check.name, version);
    } catch (error) {
      console.log(chalk.red('✗'), check.name, 'not found');
      allPassed = false;
    }
  }

  console.log();

  if (allPassed) {
    console.log(chalk.green('All checks passed!'));
  } else {
    console.log(chalk.yellow('Some checks failed. Please install missing dependencies.'));
  }
}
