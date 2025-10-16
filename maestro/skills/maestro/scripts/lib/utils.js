import fs from 'fs';
import os from 'os';
import path from 'path';
/**
 * Simple logging to file (~/.maestro-scripts/log.txt)
 */
export function log(message) {
    const timestamp = new Date().toISOString();
    const logDir = path.join(os.homedir(), '.maestro-scripts');
    const logFile = path.join(logDir, 'log.txt');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logFile, `${timestamp} ${message}\n`);
}
/**
 * Expand ~ to home directory
 */
export function expandHome(filepath) {
    if (filepath.startsWith('~/')) {
        return path.join(os.homedir(), filepath.slice(2));
    }
    return filepath;
}
/**
 * Read file with home directory expansion
 */
export function readFile(filepath) {
    return fs.readFileSync(expandHome(filepath), 'utf-8');
}
/**
 * Write file with home directory expansion
 */
export function writeFile(filepath, content) {
    fs.writeFileSync(expandHome(filepath), content, 'utf-8');
}
/**
 * Create temporary file for Maestro execution
 */
export function createTempFile(content) {
    const tmpPath = path.join(os.tmpdir(), `maestro-${Date.now()}.yaml`);
    fs.writeFileSync(tmpPath, content);
    return tmpPath;
}
/**
 * Check if file exists
 */
export function fileExists(filepath) {
    return fs.existsSync(expandHome(filepath));
}
//# sourceMappingURL=utils.js.map