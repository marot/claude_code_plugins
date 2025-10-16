---
name: Maestro test
description: Write, debug, and execute Maestro scripts to analyze and test mobile applications.
---

# Maestro script
Use this script from the this file's directory to execute Maestro scripts:
`node ./scripts/index.js`
It has the following commands:
- exec: Execute a Maestro script
- hierarchy: Retrieve information about the current app's UI hierarchy
- test: Run a Maestro test
- docs: Search docs, or fetch the cheat sheet

## Test creation / adaptation workflow
To create maestro tests:

1. Run the test:
- Read the test file, if it already exists
- Execute the test using `node ./scripts/index.js test` (Run first with --help to see options)

**The test fails** --> Follow "Collect debug information" below
**The test succeeds** --> Follow "Extend test" below

2. Collect debug information:
- Use `node ./scripts/index.js elements` and `node ./scripts/index.js hierarchy` to retrieve information about the current app's UI hierarchy (Run first with --help to see options)
- Try alternatives to the failing commands (Other text, ids, ...).
- You might run `node ./scripts/index.js docs` to retrieve a cheat sheet of maestro commands.
- You might need to re-execute the test with less steps to move into a happy state
- Make the changes to the test, and re-run it.

3. Extend test:
- Use `node ./scripts/index.js elements` and `node ./scripts/index.js hierarchy` to retrieve information about the current app's UI hierarchy (Run first with --help to see options)
- Use `node ./scripts/index.js exec` to execute individual commands.
- If they work, add them to the test.

## Debug files
Failures will be put into a directory. The command will report the location.
`Debug files available at: ...`
Files to inspect:
- commands-*.json: Contains error details and UI hierarchy at time of failure (hierarchy in error.hierarchyRoot field)
- screenshot-*.png: Visual state at failure
- maestro.log: Large file - use Grep to search for specific errors instead of reading entire file

## Examples
- `node ./scripts/index.js exec -- "- launchApp: com.apple.reminders"`

## Most used maestro commands
- launchApp: appId
- tapOn: "My text"
- tapOn
    id: "id"
- inputText: "Hello, World!"
- assertVisible
   # Same parameters as tapOn
- takeScreenshot: /tmp/MainScreen # screenshot will be stored as /tmp/MainScreen.png
