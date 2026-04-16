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
   - If neither exists, analyze based on conversation context.
     If scope is unclear and invoked as subagent, return Blocker with "scope undefined" to main agent.
     If invoked directly, ask the user to narrow the analysis target.
     Do not attempt full-codebase analysis.

## Output Structure
Required:
1. Summary — 1-2 sentence conclusion
2. Execution flow / data flow / root cause — core analysis

Contextual (include when applicable):
3. Purpose or problem — when the request includes "why"
4. Key observations — when secondary findings exist
5. Recommendation — when a next action suggestion is needed
6. Blocker — when implementation is not feasible. If present, other sections may be omitted. State reason and stop.

## Guidelines
- Focus on reasoning, structure, and cause
- Explain based on actual behavior, not abstraction
- Include state changes and failure points only when relevant
