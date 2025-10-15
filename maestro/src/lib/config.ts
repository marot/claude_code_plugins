import { expandHome, readFile, fileExists } from './utils.js';

export interface Config {
  binaryPath: string;
  apiKey: string | null;
}

/**
 * Load configuration from environment variables and default paths
 *
 * Priority:
 * 1. Environment variables (MAESTRO_BINARY_PATH, MAESTRO_API_KEY)
 * 2. Default paths (~/.maestro/bin/maestro, ~/.mobiledev/authtoken)
 * 3. Fallback to 'maestro' in PATH
 */
export function loadConfig(): Config {
  // 1. Binary path
  let binaryPath = process.env.MAESTRO_BINARY_PATH;

  if (!binaryPath) {
    const defaultPath = expandHome('~/.maestro/bin/maestro');
    if (fileExists(defaultPath)) {
      binaryPath = defaultPath;
    } else {
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
      } catch {
        // Ignore errors, API key is optional
      }
    }
  }

  return { binaryPath, apiKey };
}
