import { execSync } from 'child_process';
import chalk from 'chalk';

export const doctorChecks = [
  { name: 'Node.js', command: 'node --version', required: '>=18.0.0' },
  { name: 'npm', command: 'npm --version', required: '>=8.0.0' },
  { name: 'Git', command: 'git --version', required: '>=2.0.0' },
] as const;

export interface DoctorCheckResult {
  name: string;
  ok: boolean;
  output: string;
}

export function runDoctorChecks(
  run: (command: string, options: { encoding: 'utf-8' }) => string = execSync as any
): DoctorCheckResult[] {
  return doctorChecks.map((check) => {
    try {
      const version = run(check.command, { encoding: 'utf-8' }).trim();
      return { name: check.name, ok: true, output: version };
    } catch {
      return { name: check.name, ok: false, output: 'not found' };
    }
  });
}

export async function doctorCommand() {
  console.log(chalk.blue.bold('\nAINative Doctor\n'));

  const results = runDoctorChecks();
  let allPassed = true;

  for (const result of results) {
    if (result.ok) {
      console.log(chalk.green('OK'), result.name, result.output);
    } else {
      console.log(chalk.red('ERR'), result.name, result.output);
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
