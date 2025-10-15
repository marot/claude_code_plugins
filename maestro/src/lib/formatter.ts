import { parse, stringify } from 'yaml';

/**
 * Format Maestro flow script by:
 * 1. Removing empty lines
 * 2. Ensuring proper header (appId: any if missing)
 * 3. Adding dash prefix to commands if missing
 */
export function formatFlow(code: string): string {
  // Remove empty lines and trim
  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return 'appId: any\n---\n';
  }

  // Check if header exists (separator ---)
  const separatorIndex = lines.findIndex((line) => line === '---');
  const hasHeader = separatorIndex !== -1;

  let header = 'appId: any';
  let commands: string[] = [];

  if (hasHeader) {
    // Parse existing header
    const headerLines = lines.slice(0, separatorIndex);
    const headerYaml = headerLines.join('\n');

    try {
      const parsed = parse(headerYaml);
      if (parsed && typeof parsed === 'object') {
        // Re-stringify to normalize formatting
        header = stringify(parsed).trim();
      }
    } catch {
      // If header parsing fails, keep default
    }

    commands = lines.slice(separatorIndex + 1);
  } else {
    commands = lines;
  }

  // Ensure commands have dash prefix
  const formattedCommands = commands.map((line) =>
    line.startsWith('-') ? line : `- ${line}`
  );

  return `${header}\n---\n${formattedCommands.join('\n')}\n`;
}
