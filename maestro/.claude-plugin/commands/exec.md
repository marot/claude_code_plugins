---
allowed-tools: Bash(maestro-scripts exec*)
description: Execute inline Maestro commands for quick testing and debugging
---

## Execute Maestro Commands

This command executes inline Maestro commands directly without creating a flow file.

**Usage:** `/maestro-exec <commands>`

### Examples

**Single command:**
```
/maestro-exec tapOn: "Login"
```

**Multiple commands (use quotes):**
```
/maestro-exec "
tapOn: Login
inputText: user@example.com
tapOn: Submit
assertVisible: Welcome
"
```

**From file:**
```
/maestro-exec test.yml --file
```

---

## How It Works

The command automatically:
1. Formats your commands (adds `appId: any` header and dashes if missing)
2. Creates a temporary flow file
3. Executes it on the connected device
4. Returns the results
5. Cleans up temporary files

### Command Format

Commands can be written in simplified format:

**Simple (no dashes):**
```
tapOn: Button
inputText: text
scroll
```

**Standard (with dashes):**
```
- tapOn: Button
- inputText: text
- scroll
```

Both formats work - the tool automatically normalizes them.

### Common Commands

**Navigation:**
- `launchApp` - Launch the app
- `tapOn: "Text"` - Tap element by text
- `tapOn: { id: "elementId" }` - Tap element by ID
- `back` - Press back button (Android)

**Input:**
- `inputText: "text to type"` - Enter text in focused field
- `eraseText` - Clear text field

**Scrolling:**
- `scroll` - Scroll down
- `scroll: { direction: "UP" }` - Scroll up
- `scrollUntilVisible: "Text"` - Scroll until element appears

**Assertions:**
- `assertVisible: "Text"` - Verify element is visible
- `assertNotVisible: "Text"` - Verify element is hidden

**Timing:**
- `waitForAnimationToEnd` - Wait for animations to complete

### Use Cases

**Quick testing:**
```
# Test if an element is tappable
/maestro-exec tapOn: "Settings"
```

**Verify element exists:**
```
/maestro-exec assertVisible: "Login"
```

**Test a sequence:**
```
/maestro-exec "
launchApp
tapOn: Search
inputText: iPhone
tapOn: Search button
assertVisible: Results
"
```

**Execute from clipboard:**
```
# Copy commands to clipboard, then:
/maestro-exec "$(pbpaste)"
```

### Prerequisites

- Device or simulator must be running
- Maestro CLI must be installed
- For commands like `launchApp`, app must be installed

### Troubleshooting

**"Element not found":**
- Run `/maestro-hierarchy` to see available elements
- Check element text/ID matches exactly
- Ensure element is visible on current screen

**"Command failed":**
- Check command syntax (use `/maestro-docs` for help)
- Verify device is connected and responsive
- Ensure app is in expected state

**"Invalid YAML":**
- Check for proper indentation
- Ensure special characters are quoted
- Use standard Maestro command format

### Tips

1. **Test before writing full flows**: Use exec to verify commands work
2. **Iterate quickly**: No need to create files for simple tests
3. **Combine with hierarchy**: Get hierarchy → identify element → exec command
4. **Build incrementally**: Test each step before adding to full flow

### Related Commands

- `/maestro-hierarchy` - See available UI elements
- `/maestro-test` - Run complete flow files
- `/maestro-docs` - Query Maestro documentation
