---
allowed-tools: Bash(node */dist/index.js exec*)
description: Execute inline Maestro commands for quick testing and debugging
---

## CLI Help

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js exec --help`

## Available Maestro Commands

**Navigation:**
- `launchApp` - Launch the app
- `tapOn: "Text"` - Tap element by text
- `tapOn: { id: "elementId" }` - Tap by ID
- `back` - Back button (Android)

**Input:**
- `inputText: "text"` - Enter text
- `eraseText` - Clear field

**Scrolling:**
- `scroll` - Scroll down
- `scroll: { direction: "UP" }` - Scroll up
- `scrollUntilVisible: "Text"` - Scroll to element

**Assertions:**
- `assertVisible: "Text"` - Verify visible
- `assertNotVisible: "Text"` - Verify hidden

**Timing:**
- `waitForAnimationToEnd` - Wait for animations

Commands can be written with or without `- ` prefix. The tool auto-formats them.

## How to Use

The user provides the commands as arguments to this slash command. You should execute them using the CLI tool.

**Example execution for single command:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js exec "tapOn: Login"
```

**Example execution for multiple commands:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js exec "launchApp
tapOn: Search
inputText: iPhone
assertVisible: Results"
```

**Example execution from file:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js exec /path/to/commands.yml --file
```

## Prerequisites

- Device or simulator must be running
- Maestro CLI must be installed (`~/.maestro/bin/maestro`)
- For `launchApp`, app must be installed on device

## Need Help?

- **Query docs**: Use `/maestro:docs` to get the full Maestro command cheat sheet or ask specific questions like "How do I scroll to an element?"
- **View hierarchy**: Use `/maestro:hierarchy` to see available UI elements on the current screen
- **Run flows**: Use `/maestro:test` to execute complete test flow files
