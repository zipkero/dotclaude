---
name: analyze
description: "Standalone debugging and code comprehension utility. Explains causes, flows, and structures without writing files. Not a pre-phase for /spec-init."
---

## Role
On-demand investigation utility, not a phase. No file writes — output lands in the conversation.

Distinct from `/analyze-init`: this skill is for standalone debugging and code comprehension. `/analyze-init` writes `analysis.md` as the Phased design phase. This skill is not a pre-phase — for Phased work, invoke `/spec-init` directly.

## Context Loading
1. `$ARGUMENTS` matches `docs/<feature-name>/` or any file under it → feature mode. Read spec.md, analysis.md, and implement.md (in that order, whichever exist). Scope the analysis to this feature.
2. `$ARGUMENTS` points to a specific file or symbol → analyze that target. Read surrounding context as needed.
3. `$ARGUMENTS` empty:
   - If a `docs/<feature-name>/` directory is implied by recent conversation, load as in (1).
   - Otherwise analyze from conversation context. Proceed with stated assumptions when context provides sufficient signal (error message, file path, or symptom).

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
