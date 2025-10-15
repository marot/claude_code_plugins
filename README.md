# Maestro Scripts

CLI tools for Maestro mobile automation - designed for Claude Code.

## Installation

```bash
# Install dependencies
npm install

# Build
npm run build

# Link globally for testing
npm link
```

## Usage

The CLI provides four main commands for interacting with Maestro:

### 1. Get Device Hierarchy

Fetch the current screen view hierarchy as JSON:

```bash
# Get formatted JSON
maestro-scripts hierarchy

# Get compact JSON (single line)
maestro-scripts hierarchy --compact
```

**Output**: JSON representation of the current screen's UI elements.

### 2. Execute Inline Code

Execute Maestro commands directly:

```bash
# Execute inline code
maestro-scripts exec "tapOn: Login"

# Execute from file
maestro-scripts exec test.yml --file
```

**Note**: Code is automatically formatted before execution (adds `appId: any` header and dash prefixes if missing).

### 3. Execute Flow Files

Run complete Maestro test flows:

```bash
# Run single file
maestro-scripts test .maestro/login.yml

# Run multiple files
maestro-scripts test .maestro/login.yml .maestro/signup.yml

# Run all flows in directory
maestro-scripts test .maestro/*.yml
```

### 4. Query Documentation

Query Maestro documentation or get the syntax cheat sheet:

```bash
# Get cheat sheet
maestro-scripts docs

# Query specific question
maestro-scripts docs "How do I scroll?"
```

**Requirements**: Requires API key (see Configuration below).

## Configuration

The CLI uses the following configuration sources (in order of priority):

### 1. Environment Variables

```bash
export MAESTRO_BINARY_PATH="/path/to/maestro"
export MAESTRO_API_KEY="your-api-key"
```

### 2. Default Paths

- **Maestro binary**: `~/.maestro/bin/maestro` or `maestro` in PATH
- **API key**: `~/.mobiledev/authtoken`

### 3. Fallbacks

If no configuration is found, the CLI assumes `maestro` is available in your PATH.

## Development

```bash
# Run in dev mode (TypeScript execution)
npm run dev -- hierarchy

# Build TypeScript
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check without building
npm run lint
```

## Architecture

```
src/
├── lib/                      # Core library
│   ├── maestro-cli.ts       # Maestro CLI wrapper
│   ├── config.ts            # Configuration loading
│   ├── formatter.ts         # Flow script formatting
│   └── utils.ts             # Utilities
├── scripts/                 # Command implementations
│   ├── get-hierarchy.ts
│   ├── execute-code.ts
│   ├── execute-flow.ts
│   └── query-docs.ts
└── index.ts                 # CLI router
```

## Flow Formatting

The formatter automatically:

1. Removes empty lines
2. Adds `appId: any` header if missing
3. Adds `---` separator if missing
4. Prefixes commands with `- ` if not already prefixed

**Example**:

Input:
```
tapOn: button
scroll
```

Output:
```yaml
appId: any
---
- tapOn: button
- scroll
```

## Error Handling

- **Exit code 0**: Success
- **Exit code 1**: Error (printed to stderr)
- **Logs**: Written to `~/.maestro-scripts/log.txt`

## Examples

### Basic Flow Execution

```bash
# Execute a simple tap
maestro-scripts exec "tapOn: Login"

# Execute multiple commands
maestro-scripts exec "
launchApp
tapOn: Login
inputText: user@example.com
tapOn: Submit
assertVisible: Welcome
"
```

### Working with Files

```bash
# Execute from file
echo "tapOn: button" > test.yml
maestro-scripts exec test.yml --file

# Run full flow
maestro-scripts test .maestro/login.yml
```

### Getting Help

```bash
# Check hierarchy before writing tests
maestro-scripts hierarchy | jq '.children[].text'

# Query docs for specific commands
maestro-scripts docs "How do I assert text?"

# Get full cheat sheet
maestro-scripts docs > cheat-sheet.md
```

## License

MIT
