import { spawn } from 'child_process';
import fs from 'fs';
import { Config } from './config.js';
import { formatFlow } from './formatter.js';
import { createTempFile, log } from './utils.js';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Wrapper class for Maestro CLI operations
 */
export class MaestroCli {
  constructor(private config: Config) {}

  /**
   * Get device screen hierarchy as JSON
   */
  async getHierarchy(): Promise<string> {
    const result = await this.exec(['hierarchy']);

    if (result.exitCode !== 0) {
      throw new Error(`Failed to get hierarchy: ${result.stderr}`);
    }

    return result.stdout;
  }

  /**
   * Execute inline Maestro code
   * Automatically formats the code before execution
   */
  async runCode(code: string): Promise<ExecutionResult> {
    const formatted = formatFlow(code);
    const tmpFile = createTempFile(formatted);

    try {
      const result = await this.exec(['test', tmpFile]);

      if (result.exitCode !== 0) {
        throw new Error(result.stderr || 'Execution failed');
      }

      return result;
    } finally {
      // Cleanup temp file
      try {
        fs.unlinkSync(tmpFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Execute Maestro test files
   */
  async runTest(files: string[]): Promise<ExecutionResult> {
    const result = await this.exec(['test', ...files]);

    if (result.exitCode !== 0) {
      throw new Error(result.stderr || 'Test execution failed');
    }

    return result;
  }

  /**
   * Execute Maestro CLI command via subprocess
   */
  private exec(args: string[]): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      log(`Executing: ${this.config.binaryPath} ${args.join(' ')}`);

      const proc = spawn(this.config.binaryPath, args);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        const exitCode = code ?? 1;
        log(`Exit code: ${exitCode}`);

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode,
        });
      });

      proc.on('error', (err) => {
        log(`Process error: ${err.message}`);
        resolve({
          stdout: '',
          stderr: `Failed to execute Maestro: ${err.message}`,
          exitCode: 1,
        });
      });
    });
  }
}
