---
description: "Build a new feature end-to-end following the plan-first workflow. Analyzes requirements, plans implementation, and builds with tests and documentation."
agent: "agent"
argument-hint: "Describe the feature to build"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Build a feature following the structured plan-first workflow.

## Process

### 1. Understand
- Read the feature description carefully
- Search the codebase for related existing code, patterns, and conventions
- Identify which layers are affected (API, service, repository, UI)

### 2. Plan (present before executing)
```markdown
## Feature Plan: [Name]

### Summary
[What's being built and why]

### Files to Create
| File | Purpose |
|------|---------|
| ... | ... |

### Files to Modify
| File | Change |
|------|--------|
| ... | ... |

### Implementation Steps
1. [ ] Database migration / model changes
2. [ ] Repository layer
3. [ ] Service layer (business logic)
4. [ ] Controller / API route
5. [ ] Input validation
6. [ ] Frontend component (if applicable)
7. [ ] Integration tests
8. [ ] Documentation update

### Dependencies
- [packages, services, or tasks needed first]
```

**STOP and ask for approval before writing code.**

### 3. Execute (after approval)
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Implement layer by layer (bottom-up: DB → Service → Controller → UI)
- Add input validation at API boundaries
- Write integration tests alongside the feature
- Update README or relevant docs

### 4. Verify
- Run `npm test` to confirm all tests pass
- Run `npm run build` to confirm no type errors
- Confirm the feature meets the original requirements
- Check for any hardcoded values or missing error handling
