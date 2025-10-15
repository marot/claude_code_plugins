---
allowed-tools: Bash(maestro-scripts test*), Read
description: Execute Maestro test flow files to run mobile UI tests
---

## Run Maestro Test Flows

This command executes Maestro test flow files on connected devices or simulators.

**Usage:** `/maestro-test <file-paths>`

### Examples

**Single file:**
```
/maestro-test .maestro/login-flow.yml
```

**Multiple files:**
```
/maestro-test .maestro/login.yml .maestro/signup.yml .maestro/checkout.yml
```

**All flows in directory:**
```
/maestro-test .maestro/*.yml
```

**Specific pattern:**
```
/maestro-test .maestro/auth-*.yml
```

---

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

### Required Elements

1. **Header**: `appId: <bundle-id>` (or `appId: any` for testing)
2. **Separator**: `---`
3. **Commands**: List of Maestro commands with `- ` prefix

### Test Organization

**Recommended structure:**
```
.maestro/
├── auth/
│   ├── login-success.yml
│   ├── login-invalid.yml
│   └── logout.yml
├── onboarding/
│   └── first-time-user.yml
└── settings/
    └── profile-update.yml
```

**Naming conventions:**
- Use descriptive names: `checkout-with-coupon.yml` not `test1.yml`
- Include expected outcome: `login-success.yml`, `login-invalid-password.yml`
- Group related flows in subdirectories

## Execution Results

The command shows:
- Which test is running
- Step-by-step progress (if verbose)
- Success/failure status
- Error messages with line numbers
- Execution time

### Success Output
```
✅ login-flow.yml passed (2.5s)
```

### Failure Output
```
❌ login-flow.yml failed (1.2s)
Failed at step 4: tapOn "Submit"
Element matching "Submit" not found
```

## Debugging Failed Tests

When a test fails:

1. **Read the error message**
   - Identifies which command failed
   - Shows expected vs actual state

2. **Get current hierarchy**
   ```
   /maestro-hierarchy
   ```

3. **Test the failing command**
   ```
   /maestro-exec tapOn: "Submit"
   ```

4. **Update and re-test**
   - Fix the selector or add waits
   - Re-run: `/maestro-test path/to/flow.yml`

### Common Failures

**Element not found:**
- Element text doesn't match exactly
- Element not visible yet (add wait)
- Wrong screen (previous step failed)

**Timing issues:**
- Add `waitForAnimationToEnd` before actions
- Use `scrollUntilVisible` for elements below fold
- Add explicit assertions to verify state

**App state issues:**
- Ensure app launches correctly
- Verify previous navigation succeeded
- Check if modal/alert is blocking

## Best Practices

### Writing Robust Tests

**Use explicit assertions:**
```yaml
# Bad - assumes navigation worked
- tapOn: "Settings"
- tapOn: "Profile"

# Good - verifies each step
- tapOn: "Settings"
- assertVisible: "Settings"
- tapOn: "Profile"
- assertVisible: "Profile"
```

**Handle timing:**
```yaml
# Wait for animations
- tapOn: "Submit"
- waitForAnimationToEnd
- assertVisible: "Success"
```

**Use meaningful IDs:**
```yaml
# Prefer IDs over text (more stable)
- tapOn: { id: "submit-button" }

# Text can change with localization
- tapOn: "Submit"  # Breaks in other languages
```

### Test Isolation

Each test should:
- Start from a known state (usually app launch)
- Clean up after itself if needed
- Not depend on other tests running first
- Be runnable in any order

### Example: Login Flow

```yaml
appId: com.example.app
---
# Launch and verify home screen
- launchApp
- assertVisible: "Welcome"

# Navigate to login
- tapOn: "Sign In"
- assertVisible: "Email"
- assertVisible: "Password"

# Enter credentials
- tapOn: { id: "email-field" }
- inputText: "test@example.com"
- tapOn: { id: "password-field" }
- inputText: "password123"

# Submit and verify success
- tapOn: "Log In"
- waitForAnimationToEnd
- assertVisible: "Dashboard"
- assertVisible: "Welcome, Test User"
```

## Prerequisites

- Device or simulator running
- Maestro CLI installed and configured
- App installed on device (unless testing system apps)
- Valid flow file(s) with proper YAML syntax

## Continuous Integration

Flow files can be run in CI/CD:

```bash
# In your CI script
maestro-scripts test .maestro/**/*.yml
```

Consider:
- Running on multiple device types
- Testing different OS versions
- Parallel execution for speed
- Retry logic for flaky tests

## Related Commands

- `/maestro-hierarchy` - Inspect UI elements before writing tests
- `/maestro-exec` - Test individual commands quickly
- `/maestro-docs` - Look up command syntax and examples

## Getting Help

If tests aren't working:

1. **Use the debugger agent**: Invoke `maestro-debugger` agent for troubleshooting
2. **Query docs**: `/maestro-docs "how do I scroll to element"`
3. **Check hierarchy**: `/maestro-hierarchy` to see actual UI state
4. **Test incrementally**: Use `/maestro-exec` to test each command
