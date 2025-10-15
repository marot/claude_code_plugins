---
allowed-tools: Bash(node */dist/index.js docs*)
description: Query Maestro documentation and get syntax cheat sheet for commands
---

## Maestro Documentation

Query the Maestro documentation API or get the command syntax cheat sheet.

### CLI Usage

!`node ${CLAUDE_PLUGIN_ROOT}/dist/index.js docs --help`

**Usage:**
- `/maestro-docs` - Get full cheat sheet
- `/maestro-docs <question>` - Query specific topic

### Examples

**Get cheat sheet:**
```
/maestro-docs
```

**Query specific topic:**
```
/maestro-docs How do I scroll to an element?
```

```
/maestro-docs How do I wait for animations?
```

```
/maestro-docs How do I assert text is visible?
```

---

## Documentation Query

When you have a question about Maestro syntax or capabilities:

**Common queries:**
- "How do I tap on an element by ID?"
- "What are all the scroll options?"
- "How do I input text in a field?"
- "How do I wait for an element to appear?"
- "What's the syntax for assertions?"
- "How do I handle pop-ups?"
- "How do I take screenshots?"
- "How do I run flows conditionally?"

### Cheat Sheet Contents

The cheat sheet includes:
- All available Maestro commands
- Command syntax and parameters
- Usage examples
- Best practices
- Common patterns
- Troubleshooting tips

### API Requirements

**Note**: Documentation queries require an API key configured:

```bash
# Set API key via environment variable
export MAESTRO_API_KEY="your-api-key"

# Or store in default location
echo "your-api-key" > ~/.mobiledev/authtoken
```

Without an API key, only the basic CLI operations (hierarchy, exec, test) work. The docs query feature requires authentication to Maestro's documentation API.

## Command Reference

While you can query the docs API, here's a quick reference of common commands:

### Basic Commands

**Launch & Navigation:**
```yaml
- launchApp
- back                          # Android back button
```

**Tapping:**
```yaml
- tapOn: "Button Text"          # Tap by text
- tapOn: { id: "button-id" }    # Tap by ID
- tapOn: { index: 0 }           # Tap first matching element
```

**Text Input:**
```yaml
- inputText: "text to type"
- eraseText                     # Clear field
- hideKeyboard
```

**Scrolling:**
```yaml
- scroll                        # Scroll down
- scroll: { direction: "UP" }   # Scroll up
- scrollUntilVisible: "Text"    # Scroll until element appears
```

**Assertions:**
```yaml
- assertVisible: "Text"
- assertNotVisible: "Text"
- assertTrue: ${condition}
```

**Waiting:**
```yaml
- waitForAnimationToEnd
- waitForAnimationToEnd:
    timeout: 5000               # Custom timeout (ms)
```

**Gestures:**
```yaml
- swipe:
    direction: "LEFT"           # LEFT, RIGHT, UP, DOWN
- swipe:
    start: "50%,50%"
    end: "20%,50%"
```

**Screenshots:**
```yaml
- takeScreenshot: screenshot-name
```

**Conditions:**
```yaml
- runFlow:
    when:
      visible: "Element"
    file: conditional-flow.yml
```

### Advanced Features

**Variables:**
```yaml
- evalScript: ${OUTPUT_NAME = 'hello'}
- inputText: ${OUTPUT_NAME}
```

**Multiple Apps:**
```yaml
- launchApp:
    appId: "com.other.app"
- tapOn: "Share"
- tapOn: "com.original.app"
```

**Repeat Actions:**
```yaml
- repeat:
    times: 5
    commands:
      - scroll
      - waitForAnimationToEnd
```

## Use Cases

### Learning New Commands

When you need to:
- Find the right command for a task
- Understand command parameters
- See usage examples
- Learn best practices

**Example:**
```
/maestro-docs How do I scroll horizontally?
```

### Debugging Syntax

When you get:
- YAML syntax errors
- Command not recognized
- Parameter validation errors

**Example:**
```
/maestro-docs What's the correct syntax for tapOn with coordinates?
```

### Exploring Features

When you want to:
- Discover advanced features
- Learn about conditional flows
- Understand variable usage
- Find out about integrations

**Example:**
```
/maestro-docs How do I use variables in flows?
```

## Tips

1. **Be specific**: Ask detailed questions for better answers
2. **Include context**: Mention what you're trying to achieve
3. **Try variations**: Rephrase if first query doesn't help
4. **Check examples**: Look for example flows in the response
5. **Combine with hierarchy**: Use hierarchy + docs together

### Example Workflow

```
# 1. See what's on screen
/maestro-hierarchy

# 2. Learn how to interact with it
/maestro-docs How do I tap on an element with accessibility ID?

# 3. Test the command
/maestro-exec tapOn: { id: "login-button" }

# 4. Build full flow
/maestro-test login-flow.yml
```

## Offline Reference

For offline work or quick lookup, consider:

1. **Get cheat sheet once:**
   ```
   /maestro-docs > maestro-cheat-sheet.md
   ```

2. **Save common patterns** to your own reference file

3. **Bookmark official docs**: [https://maestro.mobile.dev](https://maestro.mobile.dev)

## Related Commands

- `/maestro-hierarchy` - See current UI elements
- `/maestro-exec` - Test commands from docs
- `/maestro-test` - Run complete flows

## Troubleshooting

**"API key not found":**
- Set `MAESTRO_API_KEY` environment variable
- Or place token in `~/.mobiledev/authtoken`

**"Rate limited":**
- Wait a moment and retry
- Consider saving cheat sheet for offline reference

**"No results found":**
- Try rephrasing your question
- Use simpler, more direct queries
- Get full cheat sheet and search manually
