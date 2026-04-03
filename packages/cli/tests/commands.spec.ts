import { describe, expect, it } from 'vitest';
import { getProviderEnvLines } from '../src/commands/add-provider';
import { doctorChecks, runDoctorChecks } from '../src/commands/doctor';
import { getPreviewArgs } from '../src/commands/preview';

describe('CLI commands', () => {
  it('returns provider environment lines for supported providers', () => {
    expect(getProviderEnvLines('openai')).toEqual(['OPENAI_API_KEY=your-openai-key']);
    expect(getProviderEnvLines('OLLAMA')).toEqual([
      'OLLAMA_BASE_URL=http://localhost:11434',
      'OLLAMA_MODEL=llama3.1',
    ]);
  });

  it('returns null for unsupported providers', () => {
    expect(getProviderEnvLines('gemini')).toBeNull();
  });

  it('runs doctor checks through the injected executor', () => {
    const results = runDoctorChecks((command) => {
      if (command === doctorChecks[0].command) return 'v22.0.0';
      if (command === doctorChecks[1].command) return '10.0.0';
      if (command === doctorChecks[2].command) return 'git version 2.45.0';
      throw new Error('unexpected command');
    });

    expect(results).toEqual([
      { name: 'Node.js', ok: true, output: 'v22.0.0' },
      { name: 'npm', ok: true, output: '10.0.0' },
      { name: 'Git', ok: true, output: 'git version 2.45.0' },
    ]);
  });

  it('builds preview args with and without a port', () => {
    expect(getPreviewArgs({})).toEqual(['run', 'preview']);
    expect(getPreviewArgs({ port: '4173' })).toEqual(['run', 'preview', '--', '--port', '4173']);
  });
});
