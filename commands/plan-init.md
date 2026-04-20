---
description: Create or rewrite PLAN.md according to rules, based on a SPEC document
---

> When to use: When SPEC exists and completion criteria need to be derived. Run after `/spec-init`, before `/implement-init`.
> Prerequisite: `/spec-init`

Create PLAN.md. This is a checkpoint document for completion judgment and verification, not an implementation roadmap.

SPEC path: $ARGUMENTS

## Role
- Define "what items must work for completion, and how we verify each."
- Translate SPEC §2 Feature Definition into verifiable Tasks with Exit Criteria.
- Hold all design / structure / order decisions in Decision Point sections. IMPLEMENT.md is a pure checklist and does not carry decisions.
- Do not list implementation methods as Tasks. Task = verifiable boundary, not mechanical step.

## Global Rules
- A Phase with unresolved Decision Points must not proceed to implementation Tasks without user approval.

## Prerequisites
- If SPEC path is empty, stop.
  - Guide: "Pass the SPEC path as argument. Example: `/plan-init spec/20260420_payment-integration.md`"
- If the SPEC file does not exist, stop and request `/spec-init` first.
- Read SPEC in full before writing. PLAN scope is bounded by SPEC §2 Feature Definition.

## Scope Handling
- SPEC defines the boundary. Cover SPEC §2 Feature Definition exhaustively — every listed feature maps to at least one Task.
- Do not expand beyond SPEC. New requirements require updating SPEC first, not inflating PLAN.

## Task Writing
- Describe as "what state is working." Use the form "when X, Y is observed."
- No implementation steps (file creation, function addition, etc.).
- No checkboxes. PLAN is a static specification document, not a progress tracker.
- Include 2-4 sentences of context.

Required per Task:
- Purpose: why this boundary exists from a verification standpoint. Do not describe implementation structure.
- Input: only verifiable preconditions (no upper-level references)
- Exit Criteria: "how do we know it's done" (1 line default; multiple observation points allowed)

## Decomposition
- Same Exit Criteria → merge. Different → separate. Same conceptual area → group visually.

## Grouping
- Adjacent Tasks in the same conceptual area get a "single-breath group" visual marker. Tasks themselves remain separate.

## Decision Point
- Design and strategy choices go into "Decision Point" sections. List options + trade-offs. Do not mix with Tasks.
- Scope covered here (all decisions live in PLAN, not IMPLEMENT):
  - Completion boundary, target behavior, acceptance envelope
  - Implementation structure: module / interface / data flow / state model
  - Execution order when multiple orderings are viable
- Unresolved Decision Points that block the target scope must be resolved before `/implement-init` proceeds.

## Phase
- Defined by "what can the user do at this point." Only units meaningless without the prior Phase.
- Phase start: include regression check of previous Phase Exit Criteria as the first Task of this Phase (not a note).

## Prohibited
- Checkboxes (`- [ ]` / `- [x]`) in Task list — PLAN is a static specification, not a progress tracker
- Deliverable fields listing files / types / interfaces — file-level detail is not a verification boundary
- Mechanical Tasks (file creation / function addition / refactoring)
- Ordering statements inside Tasks — ordering decisions belong in Decision Point when they require judgment, else in IMPLEMENT.md by dependency
- Chronological decomposition, Task count inflation, inter-Task references

## Task Examples

Single Exit Criteria:
- CLI accepts JSON input and outputs a status line without corruption
  - Purpose: verify input parser and output formatter boundaries independently
  - Input: minimal valid JSON string
  - Exit Criteria: `echo '{...}' | ./app` runs without error and produces output

Multiple Exit Criteria:
- User authentication works end-to-end with session persistence
  - Purpose: verify auth boundary from login through session recovery
  - Input: valid credentials, expired session token
  - Exit Criteria:
    - POST /login with valid credentials returns 200 and a session token
    - Subsequent requests with that token access protected resources
    - Expired token returns 401 and does not leak user data

## Output
- Project root `PLAN.md`. If file exists, confirm before overwriting.
