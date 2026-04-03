import { spawn } from 'child_process';

export function runCommand(command: string, args: string[], cwd = process.cwd()): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 0));
  });
}
