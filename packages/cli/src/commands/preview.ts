import chalk from 'chalk';
import { runCommand } from '../runner';

export async function previewCommand(options: { port?: string }) {
  console.log(chalk.blue('Starting preview server...\n'));

  const args = ['run', 'preview'];
  if (options.port) {
    args.push('--', '--port', options.port);
  }

  const code = await runCommand('npm', args);
  if (code !== 0) {
    process.exit(code || 1);
  }
}
