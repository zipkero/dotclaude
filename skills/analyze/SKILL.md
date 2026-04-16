---
name: analyze
description: Use for non-trivial analysis, design discussion, or debugging.
---

## Context Loading
1. If `$ARGUMENTS` is provided, analyze that target.
2. If `$ARGUMENTS` is empty:
   - Read PLAN.md if it exists. Identify current Phase/Task progress.
   - Read IMPLEMENT.md if it exists. Identify next unit and its design.
   - If neither exists, analyze based on the codebase and conversation context.

## Output Structure
1. Summary
2. Purpose or problem
3. Execution flow / data flow / root cause
4. Key observations
5. Recommendation (only if needed)

## Guidelines
- Focus on reasoning, structure, and cause
- Explain based on actual behavior, not abstraction
- Include state changes and failure points only when relevant
- Do not include implementation unless explicitly requested
