# AI Prompts — Documentation

## Prompt 1: Tool workflow foundation (Part A)

**Prompt:** Create `tool-workflow.md` documenting AI usage across SDLC with evidence from repository artifacts.

**AI Response:** Comprehensive workflow doc citing agents, skills, prompts, hooks, and session log examples.

**Accepted:** `tool-workflow.md` with traceability chain.  
**Changed:** Updated paths after repository restructuring.  
**Rejected:** —

---

## Prompt 2: Reflection document

**Prompt:** Write honest AI usage reflection — what worked, what didn't, human judgment required.

**AI Response:** `reflection.md` with session log citations, effective/ineffective prompt patterns, lessons learned.

**Accepted:** Full reflection with traceability table.  
**Changed:** Added "what I would do differently" section.  
**Rejected:** —

---

## Prompt 3: Submission artifact generation

**Prompt:** Restructure repository per submission document; create all required markdown files.

**AI Response:** Created `candidate-info.md`, `requirements-analysis.md`, `acceptance-criteria.md`, `implementation-plan.md`, `design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md`, `test-strategy.md`, `debugging-notes.md`, `code-review-notes.md`, `review-fixes.md`, `pr-description.md`, `final-ai-usage-summary.md`, `ai-prompts/`, `database/setup-notes.md`.

**Accepted:** Full submission structure at repository root.  
**Changed:** Populated from existing `requirements.md`, `design.md`, `reflection.md`, session logs.  
**Rejected:** —

---

## Prompt 4: PR description

**Prompt:** `/create-pull-request` — generate PR description from changes.

**AI Response:** Structured PR with summary, features, technical changes, testing, limitations.

**Accepted:** `pr-description.md`.  
**Changed:** Added restructuring notes and known limitations.  
**Rejected:** —
