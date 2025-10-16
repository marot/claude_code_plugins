import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';
import { readFile } from '../lib/utils.js';
/**
 * Execute Maestro code (inline or from file)
 */
export async function executeCode(codeOrFile, options = {}) {
    const code = options.file ? readFile(codeOrFile) : codeOrFile;
    const config = loadConfig();
    const cli = new MaestroCli(config);
    const result = await cli.runCode(code);
    console.log(result.stdout);
}
//# sourceMappingURL=execute-code.js.map