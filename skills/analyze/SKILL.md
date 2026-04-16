---
name: analyze
description: "Run when cause is unknown, design decision is needed, multiple files are affected, new interface/boundary is introduced, state/concurrency is involved, or auth/external API path is affected. Also usable for standalone debugging."
---

## Context Loading
1. If `$ARGUMENTS` points to a SPEC.md, analyze within that feature's scope.
2. If `$ARGUMENTS` is provided (non-SPEC), analyze that target.
3. If `$ARGUMENTS` is empty:
   - Read PLAN.md if it exists. Identify current Phase/Task progress.
   - Read IMPLEMENT.md if it exists. Identify next unit and its design.
   - If neither exists, analyze based on the codebase and conversation context.

## Output Structure
1. Summary
2. Purpose or problem
3. Execution flow / data flow / root cause
4. Key observations
5. Recommendation (only if needed)
6. Blocker (if implementation is not feasible): state reason and stop. Do not proceed to next phase.

## Guidelines
- Focus on reasoning, structure, and cause
- Explain based on actual behavior, not abstraction
- Include state changes and failure points only when relevant
