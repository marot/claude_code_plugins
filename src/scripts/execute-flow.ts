import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';

/**
 * Execute Maestro flow files
 */
export async function executeFlow(files: string[]): Promise<void> {
  const config = loadConfig();
  const cli = new MaestroCli(config);

  const result = await cli.runTest(files);

  console.log(result.stdout);
}
