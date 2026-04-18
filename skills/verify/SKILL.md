---
name: verify
description: "Validate completed implementation against PLAN.md Exit Criteria and IMPLEMENT.md design intent, or against SPEC.md for feature-level work. Runs in independent context. Outputs approved/rejected with evidence. Triggers after every non-trivial implementation."
---

## Context Loading
1. `$ARGUMENTS` ends with `SPEC.md` → SPEC mode. Use SPEC.md §2 Exit Criteria as validation baseline and §4 Architecture/Implementation as design intent reference. Do not cross-update IMPLEMENT.md.
2. `$ARGUMENTS` non-empty and not SPEC → target that specific Task/Unit.
3. `$ARGUMENTS` empty:
   - Read PLAN.md if it exists. Use the relevant Task's Exit Criteria as the validation baseline.
   - Read IMPLEMENT.md if it exists. Use design intent (structure, flow, rationale) as supplementary reference.
   - If neither exists, verify from request scope + code diff only. Target the most recently implemented change — working tree diff if uncommitted changes exist, otherwise `HEAD~1..HEAD`.

## Output Structure
1. Status: `approved` | `rejected`

2. Validation
- Request match
- Exit Criteria match (when PLAN.md or SPEC.md is available)
- Design intent match (when IMPLEMENT.md or SPEC.md §4 is available)
- Scope correctness
- Behavioral correctness
- Evidence (diff, test result, or explicit limitation)

3. If rejected — Issues
- Category: `style/minor` | `correctness` | `design/scope`
- List specific issues with evidence

4. If approved — Explanation
- What changed and why (2-3 sentences)
- Remaining risk (only if non-trivial)

## Completion
- Verifier does not modify files. On approval, return a verified signal to main agent identifying the Task (PLAN.md) or Exit Criteria (SPEC.md §2).
- Main agent applies the marker:
  - PLAN.md Task: prepend `✓ ` to the Task line (no checkbox — PLAN uses markers, not checkboxes).
  - SPEC.md §2 Exit Criteria: prepend `✓ ` to the EC line.
  - Implementation checkboxes (IMPLEMENT.md Units, SPEC.md §4 items) are not touched by verification — those are updated by the implementer on implementation completion.
- Partial verification (some Exit Criteria met within a Task, others pending) is recorded in this output only, not in document markers.
- When neither PLAN.md nor SPEC.md exists, skip document updates. Return the `approved` result only.

## Guidelines
- Minimum evidence: code diff. Preferred evidence: code diff + test result. If tests exist for the changed scope but were not run, note as limitation.
- When the change modifies only internal computation, conditions, or transformations (no external state, I/O, or dependency changes), diff-based reasoning is acceptable evidence if correctness is visible in the diff.
- If tests were modified as part of this change, do not rely on those tests alone as evidence (see CLAUDE.md Test).
- Reject when correctness cannot be established from available evidence.
- If evidence is missing, state the limitation explicitly.
