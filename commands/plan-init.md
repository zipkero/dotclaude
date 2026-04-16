---
description: Create or rewrite PLAN.md according to rules
---

> When to use: When completion criteria for a project/feature are not yet defined. Run before IMPLEMENT.md.

Create PLAN.md. This is a checkpoint document for completion judgment and verification, not an implementation roadmap.

Scope: $ARGUMENTS

## Role
- Define "what must work for this to be done."
- Do not list implementation methods or order.

## Global Rules
- A Phase with unresolved Decision Points must not proceed to implementation Tasks without user approval.

## Scope Handling
- Empty: write full PLAN. Provided: cover that scope only. Ambiguous: interpret as narrowly as possible.

## Task Writing
- Describe as "what state is working." Use the form "when X, Y is observed."
- No implementation steps (file creation, function addition, etc.).
- Include 2-4 sentences of context.

Required per Task:
- Purpose: why this exists as a separate boundary
- Input: only verifiable preconditions (no upper-level references)
- Deliverable: file/type/interface or externally observable behavior
- Exit Criteria: "how do we know it's done" (1 line default; multiple observation points allowed)

## Decomposition
- Same Exit Criteria → merge. Different → separate. Same conceptual area → group visually.

## Grouping
- Adjacent Tasks in the same conceptual area get a "single-breath group" visual marker. Tasks themselves remain separate.

## Decision Point
- Design choices go into "Decision Point" sections. List options + trade-offs. Do not mix with implementation Tasks.

## Phase
- Defined by "what can the user do at this point." Only units meaningless without the prior Phase.
- Phase start: include regression check of previous Phase Exit Criteria.

## Prohibited
- Mechanical Tasks (file creation / function addition / refactoring)
- Implementation order listing, chronological decomposition
- Task count inflation, inter-Task references

## Task Example
- [ ] CLI accepts JSON input and outputs a status line without corruption
  - Purpose: verify input parser and output formatter boundaries independently
  - Input: minimal valid JSON string
  - Deliverable: stdout output string, parser/formatter interfaces
  - Exit Criteria: `echo '{...}' | ./app` runs without error and produces output

## Output
- Project root `PLAN.md`. If file exists, confirm before overwriting.
