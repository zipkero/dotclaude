---
name: analyze
description: "Analyze code, debug, understand systems before changes. See CLAUDE.md Analysis Trigger for invocation conditions. Also usable for standalone debugging."
---

## Context Loading
1. If `$ARGUMENTS` points to a SPEC.md (or a path under `features/*/`): SPEC mode. Analyze within that feature's scope using SPEC.md §4 as design reference. Do not cross-update IMPLEMENT.md.
2. If `$ARGUMENTS` is provided (non-SPEC): analyze that target.
3. If `$ARGUMENTS` is empty:
   - Read PLAN.md if it exists. Identify current Phase/Task progress.
   - Read IMPLEMENT.md if it exists. Identify next unit and its design.
   - If neither exists, analyze based on conversation context. Proceed with stated assumptions when the context provides sufficient information (error message, file path, or symptom).

## Output Structure
Required:
1. Summary — 1-2 sentence conclusion
2. Execution flow / data flow / root cause — core analysis

Contextual (include when applicable):
3. Purpose or problem — when the request includes "why"
4. Key observations — when secondary findings exist
5. Recommendation — when a next action suggestion is needed
6. Blocker — state reason and stop. Two types:
   - `scope undefined`: target system/area cannot be determined.
   - `infeasible`: implementation is not feasible given current constraints.

## Guidelines
- Focus on reasoning, structure, and cause
- Explain based on actual behavior, not abstraction
- Include state changes and failure points only when relevant
