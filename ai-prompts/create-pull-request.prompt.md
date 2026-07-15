---
description: "Create a well-structured pull request with title, description, changes summary, testing notes, and checklist"
agent: "agent"
argument-hint: "Describe the changes for this PR"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Create a pull request for the current changes. Analyze the git diff and generate a comprehensive PR description.

## Steps
1. Run `git diff --stat` and `git diff` to see all changes
2. Run `git log --oneline -10` to see recent commits
3. Analyze the changes and categorize them

## PR Format
```markdown
## Title
[type]: [concise description] (e.g., feat: add ticket assignment endpoint)

## Description
[2-3 sentences explaining WHAT changed and WHY]

## Changes
- [Change 1 with affected file/module]
- [Change 2 with affected file/module]

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Refactor (no functional changes)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] All existing tests pass

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] No hardcoded secrets or PII
- [ ] Documentation updated (if needed)
- [ ] No console.log or debug statements left
```
