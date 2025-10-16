---
allowed-tools: Bash(node */dist/index.js test*), Read
description: Execute Maestro test flow files to run mobile UI tests
---

## CLI Help

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js test --help`

## How to Use

The user provides flow file path(s) as arguments. You should execute them using the CLI tool.

**Execute single file:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js test .maestro/login-flow.yml
```

**Execute multiple files:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js test .maestro/login.yml .maestro/signup.yml
```

**Execute with glob pattern:**
```bash
node ${CLAUDE_PLUGIN_ROOT}/dist/index.js test .maestro/*.yml
```

## Flow File Format

Test flows are YAML files with this structure:

```yaml
appId: com.example.app
---
- launchApp
- tapOn: "Login"
- inputText: "user@example.com"
- tapOn: "Submit"
- assertVisible: "Welcome"
```

**Required elements:**
1. **Header**: `appId: <bundle-id>` (or `appId: any` for testing)
2. **Separator**: `---`
3. **Commands**: List of Maestro commands with `- ` prefix

## Debugging Failed Tests

When a test fails:

1. Check the error message (shows which command failed)
2. Use `/maestro:hierarchy` to see current UI state
3. Use `/maestro:exec` to test the failing command
4. Fix the selector or add waits, then re-run

**Common failures:**
- Element not found (text doesn't match exactly)
- Timing issues (add `waitForAnimationToEnd`)
- Wrong screen (previous step failed)

## Prerequisites

- Device or simulator running
- Maestro CLI installed (`~/.maestro/bin/maestro`)
- App installed on device (unless testing system apps)
- Valid flow file(s) with proper YAML syntax

## Related Commands

- **View hierarchy**: Use `/maestro:hierarchy` to see UI elements before writing tests
- **Test commands**: Use `/maestro:exec` to test individual commands quickly
- **Query docs**: Use `/maestro:docs` for Maestro command syntax help
