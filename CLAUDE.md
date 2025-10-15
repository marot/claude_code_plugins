# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project provides standalone TypeScript CLI tools that enable Claude Code to interact with Maestro mobile UI testing framework. These are self-contained scripts, NOT an MCP server implementation.

**Key Point**: This is tooling FOR Claude Code to work with Maestro - we are building the tools themselves, not writing Maestro tests.

## Development Commands

```bash
# Build
npm run build                  # Compile TypeScript to dist/

# Testing
npm test                       # Run all tests
npm run test:unit             # Run unit tests only
npm run test:integration      # Run integration tests only
npm run test:watch            # Watch mode
npm run test:coverage         # Generate coverage report

# Development
npm run dev                   # Run with tsx (TypeScript execution)
npm run lint                  # Run ESLint
npm run lint:fix              # Auto-fix linting issues
npm run format                # Format with Prettier
npm run type-check            # TypeScript type checking without compilation
```

## Architecture

### Directory Structure

```
src/
├── lib/                      # Shared library code
│   ├── maestro-cli.ts       # Core wrapper for Maestro CLI subprocess calls
│   ├── maestro-api.ts       # HTTP client for api.copilot.mobile.dev
│   ├── config.ts            # Configuration loading (env vars, config files)
│   ├── logger.ts            # File-based logging (~/.maestro/mcp.log)
│   ├── formatter.ts         # YAML flow script normalization
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Common utilities (file I/O, temp files)
│
├── scripts/                 # Individual executable scripts
│   ├── get-hierarchy.ts     # Fetch device screen hierarchy
│   ├── validate-flow.ts     # Validate Maestro YAML syntax
│   ├── execute-code.ts      # Execute inline Maestro commands
│   ├── execute-flow.ts      # Execute full flow files
│   ├── format-flow.ts       # Format/normalize flow scripts
│   ├── query-docs.ts        # Query Maestro documentation API
│   └── get-cheat-sheet.ts   # Fetch syntax cheat sheet
│
└── index.ts                 # Main CLI router (commander.js)
```

### Core Components

**MaestroCli Class** (`maestro-cli.ts`):
- Wraps Maestro binary subprocess execution
- Handles temp file creation for code execution
- Provides `runCode()`, `runTest()`, `getHierarchy()`, `checkSyntax()`
- Returns structured `MaestroExecutionResult` objects

**Flow Formatter** (`formatter.ts`):
- Normalizes Maestro YAML scripts before execution
- Adds `appId: any` header if missing
- Adds `- ` prefix to commands if needed
- Removes empty lines and normalizes indentation
- Critical for accepting various input formats

**Configuration System** (`config.ts`):
- Loads from environment variables (`MAESTRO_BINARY_PATH`, `MAESTRO_API_KEY`)
- Falls back to defaults (`~/.maestro/bin/maestro`, `~/.mobiledev/authtoken`)
- Supports `.maestrorc` config file (JSON/YAML)
- Returns `MaestroConfig` object used throughout

**Logger** (`logger.ts`):
- Writes to `~/.maestro/mcp.log` by default
- Format: `YYYY-MM-DD HH:mm:ss [LEVEL] [NAME] message`
- Separate loggers per script (`createLogger('script-name')`)
- Optional console output via `--verbose` flag

### Script Architecture Pattern

Each script in `src/scripts/` follows this pattern:

```typescript
import { MaestroCli } from '../lib/maestro-cli';
import { loadConfig } from '../lib/config';
import { createLogger } from '../lib/logger';

async function scriptMain(args: any, options: ScriptOptions): Promise<void> {
  const logger = createLogger('script-name');
  const config = loadConfig(/* overrides */);
  const cli = new MaestroCli(config);

  try {
    // Script logic
    const result = await cli.someMethod();
    console.log(result);
    process.exit(0);
  } catch (error) {
    logger.error('Operation failed', error);
    console.error(error.message);
    process.exit(1);
  }
}
```

### CLI Routing

Main entry point (`src/index.ts`) uses `commander` to route subcommands:

```bash
maestro-scripts <command> [options]

Commands:
  get-hierarchy      # Device screen hierarchy
  validate-flow      # YAML syntax validation
  execute-code       # Execute inline commands
  execute-flow       # Execute flow files
  format-flow        # Format/normalize YAML
  query-docs         # Query documentation API
  get-cheat-sheet    # Fetch syntax reference
```

## Key Technical Details

### Subprocess Execution
- Use Node.js `child_process.spawn` for Maestro binary calls
- Capture stdout/stderr streams
- Handle exit codes and timeouts
- Create temp files in `os.tmpdir()` for inline code execution

### Flow Formatting Rules
1. Strip empty lines and dedent
2. Check for `---` separator (header boundary)
3. Add `appId: any\n---\n` if no header exists
4. Prefix commands with `- ` if not already prefixed and not indented
5. Return both raw and formatted versions

### Error Handling Strategy
- Custom error classes: `MaestroError`, `ConfigError`, `ValidationError`, `ExecutionError`, `ApiError`
- Log detailed errors to file with stack traces
- Display user-friendly messages to console
- Exit codes: 0 (success), 1 (error), 2 (validation error)
- Include suggestions for common errors (e.g., "No device connected" → "Start a device with...")

### Configuration Discovery Order
1. Command-line flags (highest priority)
2. Environment variables (`MAESTRO_BINARY_PATH`, `MAESTRO_API_KEY`, etc.)
3. Config file (`.maestrorc` in current directory or home)
4. Default paths (`~/.maestro/bin/maestro`, `~/.mobiledev/authtoken`)

### API Integration
- Base URL: `https://api.copilot.mobile.dev`
- Endpoints:
  - `GET /v2/bot/maestro-cheat-sheet`
  - `POST /v2/bot/query-docs` (body: `{ question: string }`)
- Authentication: `Bearer ${apiKey}` header
- Retry logic: 3 attempts with exponential backoff on 5xx errors
- Timeout: 30 seconds

## Testing Approach

### Unit Tests (`tests/unit/`)
- Test individual functions and classes in isolation
- Mock external dependencies (subprocess calls, HTTP requests, file I/O)
- Focus on logic, edge cases, and error handling
- Tools: Vitest, custom mocks

### Integration Tests (`tests/integration/`)
- Test complete script workflows end-to-end
- Use mocked Maestro binary for CI/CD (avoid requiring real devices)
- Test multi-file operations, error scenarios, CLI flags
- Can run against real Maestro locally with environment flag

### Test Fixtures (`tests/fixtures/`)
- `valid-flow.yml` - Valid Maestro flow
- `invalid-flow.yml` - Syntax errors for validation testing
- `mock-hierarchy.json` - Sample hierarchy response
- `mock-cheat-sheet.md` - Sample API response

## Maestro Background Context

This section provides context about Maestro to inform tooling development.

**Maestro** is a mobile UI testing framework for iOS/Android that uses YAML files to define test flows. Key characteristics:

- **YAML-based syntax**: Human-readable, no programming required
- **Built-in resilience**: Automatic waiting, retry logic, flakiness tolerance
- **Commands**: `tapOn`, `inputText`, `scroll`, `assertVisible`, `launchApp`, etc.
- **Flow structure**: `appId` + separator (`---`) + command list
- **Device interaction**: CLI communicates with connected devices/simulators
- **Hierarchy**: XML-like view tree of current screen state

Typical flow file:
```yaml
appId: com.example.app
---
- launchApp
- tapOn: "Login"
- inputText: "user@example.com"
- tapOn: "Submit"
- assertVisible: "Welcome"
```

Users typically:
- Store flows in `.maestro/` directory
- Run with `maestro test <file>`
- Use `maestro studio` for interactive development
- Get hierarchy with `maestro hierarchy` or via our `get-hierarchy` script

## Dependencies

### Runtime
- `commander` - CLI framework
- `axios` - HTTP client
- `yaml` - YAML parsing
- `chalk` - Terminal colors
- `ora` - Spinners for long operations
- `winston` - Structured logging

### Development
- `typescript` - Language
- `vitest` - Test runner
- `msw` - HTTP mocking for tests
- `eslint` + `@typescript-eslint/*` - Linting
- `prettier` - Code formatting
- `tsx` - TypeScript execution for development

## Build & Distribution

- Compile TypeScript to `dist/` folder
- Include type definitions (`.d.ts` files)
- Generate source maps
- Package as `@maestro/scripts` on npm (future)
- Provide `maestro-scripts` CLI binary via `bin` in package.json

Global installation:
```bash
npm install -g @maestro/scripts
maestro-scripts --help
```

## Important Conventions

1. **Always format before execution**: Call `formatFlowScript()` before running code
2. **Validate before execution**: Call `checkSyntax()` to catch errors early
3. **Log to file, print to console**: Use logger for detailed logs, console for user messages
4. **Exit codes matter**: 0 = success, 1 = error, 2 = validation error
5. **Device index defaults to 0**: Most scripts accept `--device-index` flag
6. **Temp files must be cleaned up**: Use `cleanupTempFile()` after subprocess execution
7. **API requires authentication**: All API calls need valid token from config
