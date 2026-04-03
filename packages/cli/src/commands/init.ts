import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initCommand(name?: string, options?: any) {
  console.log(chalk.blue.bold('\n🤖 AINative Project Setup\n'));

  const projectName =
    name ||
    (
      await prompts({
        type: 'text',
        name: 'name',
        message: 'Project name:',
        initial: 'my-ainative-app',
      })
    ).name;

  if (!projectName) {
    console.log(chalk.red('Project name is required'));
    process.exit(1);
  }

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Directory ${projectName} already exists`));
    process.exit(1);
  }

  const spinner = ora('Creating project...').start();

  try {
    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });

    // Copy template
    const templatePath = path.join(__dirname, '../templates/project');
    if (fs.existsSync(templatePath)) {
      fs.copySync(templatePath, projectPath);
      personalizeTemplate(projectPath, projectName);
    } else {
      // Create basic structure if template doesn't exist
      createBasicStructure(projectPath, projectName);
    }

    spinner.succeed('Project created successfully!');

    console.log(chalk.green(`\n✨ Success! Created ${projectName}\n`));
    console.log('Next steps:');
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    console.log();
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(error);
    process.exit(1);
  }
}

function createBasicStructure(projectPath: string, projectName: string) {
  // package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      'server:dev': 'tsx server.ts',
    },
    dependencies: {
      '@ainative/client': '^0.1.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.1',
      typescript: '^5.4.2',
      vite: '^5.1.4',
      tsx: '^4.7.1',
      '@ainative/server-node': '^0.1.0',
    },
  };

  fs.writeJsonSync(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  // tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      lib: ['ES2022', 'DOM'],
      jsx: 'react-jsx',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
    },
  };

  fs.writeJsonSync(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

  fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), viteConfig);

  // src/main.tsx
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { AIAppComponent, AIPane } from '@ainative/client';

function App() {
  const config = {
    apiUrl: 'http://localhost:3001',
    streamMethod: 'SSE' as const,
    debug: true,
  };

  return (
    <AIAppComponent config={config}>
      {(state, app) => (
        <AIPane
          state={state}
          onSendMessage={(msg) => app.sendMessage(msg)}
          title="AI Assistant"
        />
      )}
    </AIAppComponent>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
`;

  fs.writeFileSync(path.join(projectPath, 'src/main.tsx'), mainTsx);

  // index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(projectPath, 'index.html'), indexHtml);

  // server.ts
  const serverTs = `import { createServer } from '@ainative/server-node';

const server = createServer({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  defaultProvider: 'openai',
  port: 3001,
});

server.listen();
`;

  fs.writeFileSync(path.join(projectPath, 'server.ts'), serverTs);

  // .env.example
  const envExample = `OPENAI_API_KEY=your-api-key-here
`;

  fs.writeFileSync(path.join(projectPath, '.env.example'), envExample);
}

function personalizeTemplate(projectPath: string, projectName: string) {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = projectName;
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
}
