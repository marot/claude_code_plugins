import { spawn } from 'child_process';
import fs from 'fs';
import { formatFlow } from './formatter.js';
import { createTempFile, log } from './utils.js';
/**
 * Wrapper class for Maestro CLI operations
 */
export class MaestroCli {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Get device screen hierarchy as JSON
     */
    async getHierarchy() {
        const result = await this.exec(['hierarchy']);
        // Extract JSON from stdout (Maestro may output informational text before JSON)
        const jsonStart = Math.max(result.stdout.indexOf('{'), result.stdout.indexOf('['));
        if (jsonStart === -1) {
            throw new Error('No JSON found in hierarchy output');
        }
        return result.stdout.substring(jsonStart);
    }
    /**
     * Execute inline Maestro code
     * Automatically formats the code before execution
     */
    async runCode(code) {
        const formatted = formatFlow(code);
        const tmpFile = createTempFile(formatted);
        try {
            return await this.exec(['test', tmpFile]);
        }
        finally {
            // Cleanup temp file
            try {
                fs.unlinkSync(tmpFile);
            }
            catch {
                // Ignore cleanup errors
            }
        }
    }
    /**
     * Execute Maestro test files
     */
    async runTest(files) {
        const args = ['test'];
        // Add debug output path if configured
        if (this.config.debugOutputPath) {
            args.push('--debug-output', this.config.debugOutputPath);
            args.push('--flatten-debug-output');
        }
        args.push(...files);
        return await this.exec(args);
    }
    /**
     * Build enhanced error message with debug file inspection instructions
     */
    buildDebugErrorMessage(originalError) {
        const debugPath = this.config.debugOutputPath || '~/.maestro/tests/<timestamp>';
        return `${originalError}

Debug files available at: ${debugPath}

Files to inspect:
- commands-*.json: Contains error details and UI hierarchy at time of failure (hierarchy in error.hierarchyRoot field)
- screenshot-*.png: Visual state at failure
- maestro.log: Large file - use Grep to search for specific errors instead of reading entire file`;
    }
    /**
     * Execute Maestro CLI command via subprocess
     * Rejects on failure (non-zero exit code or spawn error)
     */
    exec(args) {
        return new Promise((resolve, reject) => {
            log(`Executing: ${this.config.binaryPath} ${args.join(' ')}`);
            const proc = spawn(this.config.binaryPath, args);
            let stdout = '';
            let stderr = '';
            let settled = false;
            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            proc.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            proc.on('close', (code) => {
                if (settled)
                    return;
                settled = true;
                const exitCode = code ?? 1;
                log(`Exit code: ${exitCode}`);
                const result = {
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    exitCode,
                };
                if (exitCode !== 0) {
                    // Prefer stderr, but include stdout if stderr is empty
                    const errorMsg = stderr.trim() ||
                        stdout.trim() ||
                        `Command exited with code ${exitCode}`;
                    log(`Command failed: ${errorMsg}`);
                    // Add debug file inspection instructions
                    const enhancedError = this.buildDebugErrorMessage(errorMsg);
                    reject(new Error(enhancedError));
                }
                else {
                    resolve(result);
                }
            });
            proc.on('error', (err) => {
                if (settled)
                    return;
                settled = true;
                const errorMsg = `Failed to execute Maestro: ${err.message}`;
                log(`Process error: ${errorMsg}`);
                reject(new Error(errorMsg));
            });
        });
    }
}
//# sourceMappingURL=maestro-cli.js.map