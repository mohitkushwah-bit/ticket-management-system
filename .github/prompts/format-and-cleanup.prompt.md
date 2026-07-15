---
description: "Format code according to project standards and remove all unused imports, variables, functions, and dead code"
agent: "agent"
argument-hint: "File or folder path to clean up"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Format and clean up the specified code:

## Tasks
1. **Remove unused imports** — Delete all import statements that are not referenced in the file
2. **Remove unused variables** — Delete variables/constants that are never used
3. **Remove unused functions** — Delete private/unexported functions that are never called
4. **Remove dead code** — Delete commented-out code blocks, unreachable code after returns
5. **Format consistently** — Ensure consistent spacing, indentation, and ordering

## Import Ordering
Organize imports in this order (with blank line between groups):
1. External packages (react, express, etc.)
2. Internal packages (@app/, @shared/, etc.)
3. Relative imports (../, ./)
4. Type imports (import type { ... })

## Rules
- Do NOT remove exports that might be used by other files — search for usages first
- Do NOT remove code that's guarded by feature flags
- Preserve all JSDoc comments on exported functions
- Keep type definitions that are part of the public API
- Run a search for function/class usages before removing anything marked "unused"
