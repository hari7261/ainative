import chalk from 'chalk';

export const providerEnvironmentConfig: Record<string, string[]> = {
  openai: ['OPENAI_API_KEY=your-openai-key'],
  anthropic: ['ANTHROPIC_API_KEY=your-anthropic-key'],
  ollama: ['OLLAMA_BASE_URL=http://localhost:11434', 'OLLAMA_MODEL=llama3.1'],
};

export function getProviderEnvLines(name: string): string[] | null {
  return providerEnvironmentConfig[name.toLowerCase()] || null;
}

export async function addProviderCommand(name: string) {
  const key = name.toLowerCase();
  const envLines = getProviderEnvLines(key);

  if (!envLines) {
    console.log(chalk.red(`Unsupported provider: ${name}`));
    console.log(chalk.yellow(`Supported providers: ${Object.keys(providerEnvironmentConfig).join(', ')}`));
    process.exit(1);
  }

  console.log(chalk.green(`\nAdd the following environment variables for ${key}:\n`));
  envLines.forEach((line) => console.log(line));
  console.log();
}
