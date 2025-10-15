---
allowed-tools: Bash(node */dist/index.js hierarchy*)
description: Get the current device screen UI hierarchy as JSON to understand available UI elements for testing
---

## Device Screen Hierarchy

This command fetches the current screen's UI element hierarchy from the connected device or simulator.

### CLI Usage

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js hierarchy --help`

### Current Hierarchy

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js hierarchy`

---

## Usage

The hierarchy output shows all UI elements currently visible on the screen, including:
- Element IDs and accessibility identifiers
- Text labels and content
- Element types (button, text field, image, etc.)
- Visibility and enabled states
- Element positions and bounds

### How to Use This Information

**Writing Tests:**
- Identify element selectors (IDs, text) for `tapOn`, `inputText`, etc.
- Find unique identifiers for reliable element selection
- Understand the screen structure and navigation paths

**Debugging Tests:**
- Compare expected vs actual UI state
- Verify element text matches your selectors
- Check if elements are hidden or disabled
- Identify why elements aren't being found

### Common Patterns

**Find tappable elements:**
```bash
# Look for buttons or tappable text
maestro-scripts hierarchy | grep -i "button\|text"
```

**Find text fields:**
```bash
# Look for input fields
maestro-scripts hierarchy | grep -i "textfield\|input"
```

**Search for specific element:**
```bash
# Search for element containing "Login"
maestro-scripts hierarchy | grep -i "login"
```

### Example Flow

1. Launch your app or navigate to the screen you want to test
2. Run `/maestro-hierarchy` to see all available elements
3. Identify the elements you need (buttons, fields, labels)
4. Write your Maestro test using the element IDs or text
5. Use `/maestro-exec` to test individual commands
6. Create full flow files with `/maestro-test`

### Prerequisites

- Device or simulator must be running and connected
- App should be launched and on the desired screen
- Maestro CLI must be installed and configured

### Troubleshooting

If hierarchy is empty or shows errors:
- Check if device/simulator is running: `open -a Simulator`
- Verify Maestro can detect devices
- Ensure app is launched and visible
- Check Maestro binary path in configuration

### Next Steps

After viewing the hierarchy:
- Use element IDs/text in your test commands
- Test individual commands with `/maestro-exec`
- Write full test flows and save to files
- Run flows with `/maestro-test`
