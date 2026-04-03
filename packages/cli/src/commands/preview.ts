import chalk from 'chalk';
import { runCommand } from '../runner';

export function getPreviewArgs(options: { port?: string }) {
  const args = ['run', 'preview'];
  if (options.port) {
    args.push('--', '--port', options.port);
  }
  return args;
}

export async function previewCommand(options: { port?: string }) {
  console.log(chalk.blue('Starting preview server...\n'));

  const args = getPreviewArgs(options);
  const code = await runCommand('npm', args);
  if (code !== 0) {
    process.exit(code || 1);
  }
}
