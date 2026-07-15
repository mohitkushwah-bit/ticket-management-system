---
description: "Plan first, then execute after approval. Use this workflow for any feature, bug fix, or change request to ensure proper planning before implementation."
agent: "agent"
argument-hint: "Describe the task, feature, or bug to plan"
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, vscode/toolSearch, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---
Follow the Plan-First workflow. DO NOT write any code until the plan is explicitly approved.

## Workflow

### Step 1: Understand
- Read the requirement thoroughly
- Search the codebase for related existing code
- Identify affected systems, files, and dependencies

### Step 2: Plan
Produce a structured plan:

```markdown
## Plan: [Task Title]

### Summary
[What will be done and why]

### Scope
- **Size**: Small / Medium / Large
- **Risk**: Low / Medium / High

### Files to Create
| File | Purpose |
|------|---------|
| path/to/file.ts | [what it does] |

### Files to Modify
| File | Changes |
|------|---------|
| path/to/file.ts | [what changes] |

### Dependencies
- [External packages needed]
- [Other tasks this depends on]

### Tasks (in order)
1. [ ] [Task 1]
2. [ ] [Task 2]
3. [ ] [Task 3]

### Testing Plan
- [ ] [What tests to write]
- [ ] [What to verify manually]

### Risks
- [Risk 1 and mitigation]
```

### Step 3: WAIT
**STOP HERE.** Present the plan and ask: "Does this plan look good? Should I proceed with implementation?"

### Step 4: Execute (only after approval)
- Implement step-by-step following the plan
- Mark tasks complete as you go
- Run tests after each logical change

### Step 5: Verify
- Run full test suite
- Validate against original requirements
- Confirm nothing unplanned was added
