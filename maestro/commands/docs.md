---
allowed-tools: Bash(node */dist/index.js docs*)
description: Query Maestro documentation and get syntax cheat sheet for commands
---

## CLI Help

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js docs --help`

## How to Use

**Get full cheat sheet (no arguments):**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js docs
```

**Query specific topic:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js docs "How do I scroll to an element?"
```

## Command Quick Reference

**Navigation:**
- `launchApp` - Launch app
- `tapOn: "Text"` / `tapOn: { id: "id" }` - Tap element
- `back` - Back button (Android)

**Input:**
- `inputText: "text"` - Enter text
- `eraseText` - Clear field
- `hideKeyboard`

**Scrolling:**
- `scroll` / `scroll: { direction: "UP" }` - Scroll
- `scrollUntilVisible: "Text"` - Scroll to element

**Assertions:**
- `assertVisible: "Text"` - Verify visible
- `assertNotVisible: "Text"` - Verify hidden

**Timing:**
- `waitForAnimationToEnd` - Wait for animations

**Gestures:**
- `swipe: { direction: "LEFT" }` - Swipe
- `takeScreenshot: name` - Screenshot

**Advanced:**
- `evalScript: ${VAR = 'value'}` - Variables
- `repeat: { times: 5, commands: [...] }` - Repeat
- `runFlow: { when: { visible: "X" }, file: "y.yml" }` - Conditional

## API Requirements

Documentation queries require an API key:

```bash
export MAESTRO_API_KEY="your-api-key"
# Or store in ~/.mobiledev/authtoken
```

Without an API key, only basic CLI operations (hierarchy, exec, test) work.

## Related Commands

- **View hierarchy**: Use `/maestro:hierarchy` to see UI elements
- **Test commands**: Use `/maestro:exec` to test individual commands
- **Run flows**: Use `/maestro:test` to execute flow files
