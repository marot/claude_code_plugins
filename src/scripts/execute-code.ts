import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';
import { readFile } from '../lib/utils.js';

export interface ExecuteCodeOptions {
  file?: boolean;
}

/**
 * Execute Maestro code (inline or from file)
 */
export async function executeCode(
  codeOrFile: string,
  options: ExecuteCodeOptions = {}
): Promise<void> {
  const code = options.file ? readFile(codeOrFile) : codeOrFile;

  const config = loadConfig();
  const cli = new MaestroCli(config);

  const result = await cli.runCode(code);

  console.log(result.stdout);
}
