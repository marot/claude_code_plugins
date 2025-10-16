/**
 * Simple logging to file (~/.maestro-scripts/log.txt)
 */
export declare function log(message: string): void;
/**
 * Expand ~ to home directory
 */
export declare function expandHome(filepath: string): string;
/**
 * Read file with home directory expansion
 */
export declare function readFile(filepath: string): string;
/**
 * Write file with home directory expansion
 */
export declare function writeFile(filepath: string, content: string): void;
/**
 * Create temporary file for Maestro execution
 */
export declare function createTempFile(content: string): string;
/**
 * Check if file exists
 */
export declare function fileExists(filepath: string): boolean;
//# sourceMappingURL=utils.d.ts.map