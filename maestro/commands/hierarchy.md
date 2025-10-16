---
allowed-tools: Bash(node */dist/index.js hierarchy*)
description: Get the current device screen UI hierarchy as JSON to understand available UI elements for testing
---

## CLI Help

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js hierarchy --help`

## Get Current Hierarchy

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js hierarchy`

## What This Shows

The hierarchy output displays all UI elements currently visible on the screen:
- Element IDs and accessibility identifiers
- Text labels and content
- Element types (button, text field, image, etc.)
- Visibility and enabled states
- Element positions and bounds

## How to Use This Information

**For writing tests:**
- Identify element selectors (IDs, text) for `tapOn`, `inputText`, etc.
- Find unique identifiers for reliable element selection
- Understand the screen structure

**For debugging tests:**
- Compare expected vs actual UI state
- Verify element text matches your selectors
- Check if elements are hidden or disabled
- Identify why elements aren't being found

## Prerequisites

- Device or simulator must be running and connected
- App should be launched and on the desired screen
- Maestro CLI must be installed (`~/.maestro/bin/maestro`)

## Troubleshooting

If hierarchy is empty or shows errors:
- Check if device/simulator is running: `open -a Simulator`
- Verify Maestro can detect devices
- Ensure app is launched and visible

## Related Commands

- **Execute commands**: Use `/maestro:exec` to test individual Maestro commands
- **Run flows**: Use `/maestro:test` to execute complete test flow files
- **Query docs**: Use `/maestro:docs` for Maestro command syntax help
