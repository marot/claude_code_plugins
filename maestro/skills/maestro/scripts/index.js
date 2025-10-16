#!/usr/bin/env node
import { Command } from 'commander';
import { getHierarchy } from './scripts/get-hierarchy.js';
import { getElements } from './scripts/get-elements.js';
import { executeCode } from './scripts/execute-code.js';
import { executeFlow } from './scripts/execute-flow.js';
import { queryDocs } from './scripts/query-docs.js';
const program = new Command();
program
    .name('maestro-scripts')
    .description('CLI tools for Maestro mobile automation')
    .version('1.0.0')
    .configureOutput({
    writeErr: (str) => process.stderr.write(str),
});
// Get device screen hierarchy
program
    .command('hierarchy')
    .description('Get device screen hierarchy as JSON')
    .option('--json', 'Pretty-print JSON output (formatted with indentation)')
    .option('-q, --query <pattern>', 'Regex pattern to filter nodes')
    .option('--search-in <attributes...>', 'Attributes to search in (space-separated)', ['text', 'resource-id', 'content-desc'])
    .option('-p, --parent-levels <number>', 'Number of parent levels to traverse up from matches', (value) => parseInt(value, 10), 0)
    .action((opts) => {
    getHierarchy(opts).catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
// Execute inline code or from file
program
    .command('exec <code>')
    .description('Execute Maestro code (inline or from file with --file)')
    .option('--file', 'Read code from file instead of inline')
    .action((code, opts) => {
    executeCode(code, opts).catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
// Execute flow files
program
    .command('test <files...>')
    .description('Execute Maestro flow files')
    .action((files) => {
    executeFlow(files).catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
// Query documentation or get cheat sheet
program
    .command('docs [query]')
    .description('Query docs (with query) or get cheat sheet (no query)')
    .action((query) => {
    queryDocs(query).catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
// Get all non-empty elements from hierarchy
program
    .command('elements')
    .description('Extract all non-empty text, resource-id, content-desc, and accessibilityText values')
    .option('--json', 'Pretty-print JSON output (formatted with indentation)')
    .option('--attributes <attrs...>', 'Attributes to extract (space-separated)', ['text', 'resource-id', 'content-desc', 'accessibilityText'])
    .action((opts) => {
    getElements(opts).catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
program.parse();
//# sourceMappingURL=index.js.map