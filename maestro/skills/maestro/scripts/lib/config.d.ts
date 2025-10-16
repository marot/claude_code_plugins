export interface Config {
    binaryPath: string;
    apiKey: string | null;
    debugOutputPath?: string;
}
/**
 * Load configuration from environment variables and default paths
 *
 * Priority:
 * 1. Environment variables (MAESTRO_BINARY_PATH, MAESTRO_API_KEY, MAESTRO_DEBUG_OUTPUT)
 * 2. Default paths (~/.maestro/bin/maestro, ~/.mobiledev/authtoken)
 * 3. Fallback to 'maestro' in PATH
 */
export declare function loadConfig(): Config;
//# sourceMappingURL=config.d.ts.map