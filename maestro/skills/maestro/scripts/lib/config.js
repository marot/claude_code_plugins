import { expandHome, readFile, fileExists } from './utils.js';
/**
 * Load configuration from environment variables and default paths
 *
 * Priority:
 * 1. Environment variables (MAESTRO_BINARY_PATH, MAESTRO_API_KEY, MAESTRO_DEBUG_OUTPUT)
 * 2. Default paths (~/.maestro/bin/maestro, ~/.mobiledev/authtoken)
 * 3. Fallback to 'maestro' in PATH
 */
export function loadConfig() {
    // 1. Binary path
    let binaryPath = process.env.MAESTRO_BINARY_PATH;
    if (!binaryPath) {
        const defaultPath = expandHome('~/.maestro/bin/maestro');
        if (fileExists(defaultPath)) {
            binaryPath = defaultPath;
        }
        else {
            binaryPath = 'maestro'; // Assume in PATH
        }
    }
    // 2. API key
    let apiKey = process.env.MAESTRO_API_KEY || null;
    if (!apiKey) {
        const tokenPath = expandHome('~/.mobiledev/authtoken');
        if (fileExists(tokenPath)) {
            try {
                apiKey = readFile(tokenPath).trim();
            }
            catch {
                // Ignore errors, API key is optional
            }
        }
    }
    // 3. Debug output path (default to project-relative .maestro/debug)
    const debugOutputPath = process.env.MAESTRO_DEBUG_OUTPUT || '.maestro/debug';
    return { binaryPath, apiKey, debugOutputPath };
}
//# sourceMappingURL=config.js.map