# Maestro Scripts

CLI tools and Claude Code plugin for Maestro mobile automation.

> This project provides both a standalone CLI tool and a Claude Code plugin for seamless integration with Claude's AI assistant.

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

## Claude Code Plugin

This project includes a Claude Code plugin that provides specialized agents and slash commands for Maestro workflows.

### Plugin Installation

#### Option 1: Install from Local Directory (For Development/Testing)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/claude-maestro
   cd claude-maestro
   ```

2. **Install the CLI tool:**
   ```bash
   npm install
   npm run build
   npm link  # Or: npm install -g
   ```

3. **Install the plugin in Claude Code:**

   In Claude Code, run:
   ```
   /plugin marketplace add ./path/to/claude-maestro
   /plugin install maestro@local
   ```

   Or for the current directory:
   ```
   /plugin marketplace add .
   /plugin install maestro@local
   ```

#### Option 2: Install from GitHub (Once Published)

In Claude Code, run:
```
/plugin marketplace add yourusername/claude-maestro
/plugin install maestro
```

#### Option 3: Team Setup (Automatic Installation)

Add to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "maestro": {
      "source": {
        "source": "github",
        "repo": "yourusername/claude-maestro"
      }
    }
  }
}
```

Then team members can install with:
```
/plugin install maestro
```

#### Verify Installation

After installation, verify the plugin is working:
```
/maestro-hierarchy
```

You should see the device hierarchy command execute.

### Plugin Features

#### Specialized Agents

**`maestro-test-writer`** - Expert agent for writing Maestro test flows
- Analyzes device UI hierarchies
- Generates robust test scripts
- Provides best practices and patterns
- Validates test syntax

**Usage:** Invoke the agent when writing tests:
```
Use the maestro-test-writer agent to create a login flow test
```

**`maestro-debugger`** - Specialist for troubleshooting test failures
- Analyzes error messages and stack traces
- Identifies root causes (timing, selectors, state)
- Suggests targeted fixes
- Provides debugging workflows

**Usage:** Invoke when tests fail:
```
Use the maestro-debugger agent to fix this failing test
```

#### Slash Commands

**`/maestro-hierarchy`** - Get device screen UI hierarchy
```bash
/maestro-hierarchy
```
Returns JSON representation of current screen elements for writing tests.

**`/maestro-exec <code>`** - Execute inline Maestro commands
```bash
# Single command
/maestro-exec tapOn: "Login"

# Multiple commands
/maestro-exec "
tapOn: Login
inputText: user@example.com
tapOn: Submit
"
```
Quick testing without creating flow files.

**`/maestro-test <files>`** - Run Maestro test flows
```bash
# Single file
/maestro-test .maestro/login.yml

# Multiple files
/maestro-test .maestro/login.yml .maestro/signup.yml

# All flows
/maestro-test .maestro/*.yml
```
Execute complete test flows and get results.

**`/maestro-docs [query]`** - Query Maestro documentation
```bash
# Get cheat sheet
/maestro-docs

# Query specific topic
/maestro-docs How do I scroll to an element?
```
Access Maestro command reference and examples.

### Plugin Workflows

#### Writing a New Test

1. Launch your app and navigate to the screen
2. Get UI hierarchy: `/maestro-hierarchy`
3. Invoke agent: "Use maestro-test-writer to create a test for login flow"
4. Agent will analyze hierarchy and generate the flow
5. Test it: `/maestro-exec <commands>` or `/maestro-test flow.yml`

#### Debugging a Failing Test

1. Run the test: `/maestro-test failing-test.yml`
2. Note the error message
3. Invoke agent: "Use maestro-debugger to fix this test failure"
4. Agent will:
   - Analyze the error
   - Get current hierarchy
   - Identify the issue
   - Suggest a fix
5. Apply the fix and re-test

#### Quick Command Testing

1. Get current screen: `/maestro-hierarchy`
2. Test individual commands: `/maestro-exec tapOn: "Button"`
3. Iterate until the command works
4. Add to your flow file

### Plugin Configuration

The plugin uses the same configuration as the CLI:

**Environment variables:**
```bash
export MAESTRO_BINARY_PATH="/path/to/maestro"
export MAESTRO_API_KEY="your-api-key"
```

**Default locations:**
- Maestro binary: `~/.maestro/bin/maestro`
- API key: `~/.mobiledev/authtoken`

### Plugin Development

The plugin is located in `.claude-plugin/`:

```
.claude-plugin/
├── plugin.json              # Plugin manifest
├── agents/                  # AI agents
│   ├── maestro-test-writer.md
│   └── maestro-debugger.md
└── commands/                # Slash commands
    ├── hierarchy.md
    ├── exec.md
    ├── test.md
    └── docs.md
```

**Validate the plugin:**
```bash
claude plugin validate .
```

**Modify agents:**
Edit `.claude-plugin/agents/*.md` to customize agent behavior and instructions.

**Modify commands:**
Edit `.claude-plugin/commands/*.md` to customize command prompts and allowed tools.

**Update manifest:**
Edit `.claude-plugin/plugin.json` to add/remove agents or commands, then run validation.

### Sharing the Plugin

#### Publishing to GitHub

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Users install directly from GitHub:**
   ```
   /plugin marketplace add yourusername/claude-maestro
   /plugin install maestro
   ```

#### Creating a Marketplace

To create a marketplace with multiple plugins, create a `.claude-plugin/marketplace.json`:

```json
{
  "name": "maestro-marketplace",
  "version": "1.0.0",
  "description": "Marketplace for Maestro mobile testing plugins",
  "plugins": {
    "maestro": {
      "source": {
        "source": "github",
        "repo": "yourusername/claude-maestro"
      }
    }
  }
}
```

#### Local Testing

For local development and testing:

```bash
# In Claude Code, from your project directory:
/plugin marketplace add .
/plugin install maestro@local

# Make changes to agents or commands
# Reload the plugin:
/plugin reload maestro
```

## License

MIT
