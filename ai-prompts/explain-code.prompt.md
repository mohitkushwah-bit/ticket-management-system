---
description: "Explain code, methods, classes, or modules in plain language. Breaks down logic, data flow, dependencies, and purpose."
agent: "agent"
argument-hint: "Paste code or specify file/method to explain"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Explain the provided code clearly and thoroughly.

## Explanation Structure

### 1. Purpose
- What does this code do? (1-2 sentences, plain language)
- Why does it exist? (business context if identifiable)

### 2. How It Works
- Step-by-step walkthrough of the logic
- Key decision points and branching
- Data transformations applied

### 3. Data Flow
- What inputs does it receive? (parameters, dependencies)
- What outputs does it produce? (return values, side effects)
- What external systems does it interact with?

### 4. Dependencies
- What does this code depend on? (imports, injected services)
- What depends on this code? (callers, consumers)

### 5. Key Concepts
- Design patterns used (if any)
- Notable algorithms or techniques
- TypeScript/language features leveraged

### 6. Potential Concerns
- Edge cases that might not be handled
- Performance considerations
- Error scenarios

## Rules
- Use plain language — avoid jargon unless explaining it
- Use analogies for complex concepts
- Reference line numbers when explaining specific parts
- If the code is complex, use a diagram or numbered flow
- Mention if something looks like a bug or anti-pattern
