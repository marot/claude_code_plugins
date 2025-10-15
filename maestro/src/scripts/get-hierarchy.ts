import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';

export interface GetHierarchyOptions {
  compact?: boolean;
}

/**
 * Get device screen hierarchy and output as JSON
 */
export async function getHierarchy(
  options: GetHierarchyOptions = {}
): Promise<void> {
  const config = loadConfig();
  const cli = new MaestroCli(config);

  const hierarchy = await cli.getHierarchy();

  // Parse and re-stringify for consistent formatting
  const parsed = JSON.parse(hierarchy);
  const formatted = JSON.stringify(parsed, null, options.compact ? 0 : 2);

  console.log(formatted);
}
