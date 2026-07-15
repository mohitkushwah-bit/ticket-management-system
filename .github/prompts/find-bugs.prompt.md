---
description: "Find bugs, logic errors, potential runtime failures, and code smells in the specified code or file"
agent: "agent"
argument-hint: "File path or paste code to analyze for bugs"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Analyze the provided code for bugs, logic errors, and potential failures.

## Analysis Categories

### 1. Logic Errors
- Incorrect conditions or comparisons
- Off-by-one errors
- Wrong operator (= vs ==, && vs ||)
- Inverted boolean logic
- Missing break/return statements

### 2. Runtime Failures
- Null/undefined access without checks
- Array index out of bounds
- Type coercion issues
- Unhandled promise rejections
- Division by zero possibilities

### 3. Async Issues
- Race conditions
- Missing await keywords
- Unhandled rejection paths
- Deadlocks or infinite loops
- Stale closures in React hooks

### 4. Security Vulnerabilities
- SQL injection (string concatenation in queries)
- XSS (unescaped user input in templates)
- Missing input validation
- Hardcoded secrets
- Insecure deserialization

### 5. Edge Cases
- Empty arrays/objects
- Very large inputs
- Special characters or unicode
- Concurrent access
- Network timeouts

## Output Format
For each bug found:
```markdown
### [Severity: Critical/High/Medium/Low] — [Bug Type]
**Location**: file:line
**Issue**: What's wrong
**Impact**: What could go wrong at runtime
**Fix**: Suggested correction with code
```

## Summary
```markdown
| Severity | Count | Category |
|----------|-------|----------|
| Critical | N | ... |
| High | N | ... |
| Medium | N | ... |
| Low | N | ... |
```

## Rules
- Check EVERY code path, not just the happy path
- Consider what happens with null, undefined, empty, or unexpected input
- Look for missing error handling around I/O operations
- Verify loop termination conditions
- Check for resource leaks (unclosed connections, streams)
