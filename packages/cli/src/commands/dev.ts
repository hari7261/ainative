import { spawn } from 'child_process';
import chalk from 'chalk';

export async function devCommand(_options: any) {
  console.log(chalk.blue('Starting development server...\n'));

  const vite = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  vite.on('error', (error) => {
    console.error(chalk.red('Failed to start dev server:'), error);
    process.exit(1);
  });
}
