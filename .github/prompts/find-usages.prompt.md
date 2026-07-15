---
description: "Find all usages of a function, class, method, service, or any code symbol across the entire project"
agent: "agent"
argument-hint: "Name of the function, class, or method to find"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Find ALL usages of the specified symbol across the entire project.

## Steps
1. Search for the symbol name across all files
2. Categorize each usage:
   - **Definition**: Where it's defined/declared
   - **Import**: Where it's imported
   - **Direct Call**: Where it's called/invoked
   - **Reference**: Where it's passed as argument or assigned
   - **Test**: Where it's used in test files
   - **Type Usage**: Where its type is referenced

## Output Format
```markdown
## Usage Report: `[symbol name]`

### Definition
- [file:line] — [context]

### Imports (N files)
- [file:line] — import { Symbol } from '...'

### Direct Calls (N occurrences)
- [file:line] — [code snippet]
- [file:line] — [code snippet]

### References (N occurrences)
- [file:line] — [how it's referenced]

### Test Usage (N files)
- [file:line] — [test context]

### Summary
- Total files: N
- Total usages: N
- Safe to modify: [Yes/No — explain if removing would break things]
```

## Rules
- Search for exact name AND common patterns (e.g., `service.method()`)
- Check barrel exports (index.ts files)
- Check configuration files that might reference it
- Include usage in comments/documentation
- Flag if removing this symbol would be a breaking change
