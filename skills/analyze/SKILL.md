---
name: analyze
description: "Analyze code, debug, understand systems before changes. See CLAUDE.md Analysis Trigger for invocation conditions. Also usable for standalone debugging."
---

## Context Loading
1. `$ARGUMENTS` ends with `SPEC.md` → SPEC mode. Analyze within that feature's scope using SPEC.md §2 Exit Criteria and §3 Decision Points as references.
2. `$ARGUMENTS` non-empty and not SPEC → analyze that target.
3. `$ARGUMENTS` empty:
   - Read PLAN.md if it exists. Identify current Phase/Task progress and relevant Decision Points.
   - Read IMPLEMENT.md if it exists. Identify next Unit and its mapped PLAN Task (IMPLEMENT carries no design content — consult PLAN for design).
   - If neither exists, analyze from conversation context. Proceed with stated assumptions when context provides sufficient signal (error message, file path, or symptom).

## Output Structure
Required:
1. Summary — 1-2 sentence conclusion
2. Execution flow / data flow / root cause — core analysis

Contextual (include when applicable):
3. Purpose or problem — when the request includes "why"
4. Key observations — when secondary findings exist
5. Recommendation — when a next action suggestion is needed
6. Blocker — state reason and stop. Three types:
   - `scope undefined`: target system/area cannot be determined after inspecting available context.
   - `infeasible`: implementation is not feasible given current constraints. Requires concrete evidence from source.
   - `needs input`: analysis cannot converge without a user decision or external information.

   Every Blocker must include:
   - Evidence: what was inspected (files, logs, errors) and what was found.
   - Unblock requires: specific info/decision/change that would resolve the block.

## Guidelines
- Focus on reasoning, structure, and cause
- Explain based on actual behavior, not abstraction
- Include state changes and failure points only when relevant
- Blocker is evidence-based only. Read the relevant source (file / log / error trace) before declaring. Assumption-only Blockers are prohibited.
- Every Blocker must include an unblock path — what information, decision, or change would resolve it.
