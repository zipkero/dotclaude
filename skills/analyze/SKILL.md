---
name: analyze
description: "Analyze code, debug, understand systems before changes. See CLAUDE.md Analysis Trigger for invocation conditions. Also usable for standalone debugging."
---

## Context Loading
1. `$ARGUMENTS` matches a feature doc path (`features/<yyyyMMdd>_<title>.md`) → feature-doc mode. Analyze within that feature's scope using the feature doc §2 Exit Criteria and §3 Decision Points as references. Also read the upstream SPEC referenced in §1 when behavioral intent needs clarification.
2. `$ARGUMENTS` matches a SPEC path (`spec/<yyyyMMdd>_<title>.md`) → SPEC mode. Analyze within the scope of SPEC §2 Feature Definition. This mode is for pre-PLAN / pre-feature-doc analysis; no Exit Criteria or Decision Points exist yet.
3. `$ARGUMENTS` non-empty and not a SPEC or feature doc → analyze that target.
4. `$ARGUMENTS` empty:
   - Read PLAN.md if it exists. Identify current Phase/Task progress and relevant Decision Points.
   - Read IMPLEMENT.md if it exists. Identify next Unit and its mapped PLAN Task (IMPLEMENT carries no design content — consult PLAN for design).
   - If neither exists, analyze from conversation context. Proceed with stated assumptions when context provides sufficient signal (error message, file path, or symptom).

## Output Structure
Required:
1. Summary — 1-2 sentence conclusion. `No issues found` is a valid conclusion when inspection yields nothing actionable; state what was inspected and why no action is needed. Do not fabricate concerns to justify the analysis.
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
- Do not project generic checklists (security / performance / compliance / SLO / contract) onto the target. Each item must be verified against this project's code or spec before being reported. Unverified generic concerns must not appear in output.
