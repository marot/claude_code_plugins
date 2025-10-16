import { Config } from './config.js';
export interface ExecutionResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}
/**
 * Wrapper class for Maestro CLI operations
 */
export declare class MaestroCli {
    private config;
    constructor(config: Config);
    /**
     * Get device screen hierarchy as JSON
     */
    getHierarchy(): Promise<string>;
    /**
     * Execute inline Maestro code
     * Automatically formats the code before execution
     */
    runCode(code: string): Promise<ExecutionResult>;
    /**
     * Execute Maestro test files
     */
    runTest(files: string[]): Promise<ExecutionResult>;
    /**
     * Build enhanced error message with debug file inspection instructions
     */
    private buildDebugErrorMessage;
    /**
     * Execute Maestro CLI command via subprocess
     * Rejects on failure (non-zero exit code or spawn error)
     */
    private exec;
}
//# sourceMappingURL=maestro-cli.d.ts.map