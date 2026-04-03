import { spawn } from 'child_process';
import chalk from 'chalk';

export async function buildCommand(options: any) {
  console.log(chalk.blue('Building project...\n'));

  const build = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true,
  });

  build.on('close', (code) => {
    if (code === 0) {
      console.log(chalk.green('\n✨ Build complete!'));
    } else {
      console.error(chalk.red(`\nBuild failed with code ${code}`));
      process.exit(code || 1);
    }
  });
}
