#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';
import { doctorCommand } from './commands/doctor';
import { previewCommand } from './commands/preview';
import { addProviderCommand } from './commands/add-provider';

const program = new Command();

program
  .name('ainative')
  .description('AINative CLI - Build AI-native applications')
  .version('0.1.1');

program
  .command('init')
  .description('Initialize a new AINative project')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'basic')
  .action(initCommand);

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(devCommand);

program
  .command('build')
  .description('Build project for production')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .action(buildCommand);

program
  .command('preview')
  .description('Preview the production build')
  .option('-p, --port <port>', 'Port number', '4173')
  .action(previewCommand);

program
  .command('doctor')
  .description('Check system dependencies and configuration')
  .action(doctorCommand);

program
  .command('add-provider')
  .description('Print environment setup for a provider')
  .argument('<name>', 'Provider name')
  .action(addProviderCommand);

program.parse();
