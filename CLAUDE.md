# Core Behavior

## Language & Tone
- Response language: Korean, casual but professional. Direct, fact-based.
- Document language: English (CLAUDE.md, skills, agents, commands, plans).

## Response
- Answer first. Explain when it improves correctness or decision-making.
- Include trade-offs/failure cases when they impact correctness, design decisions, or future risk.
- Stay in scope. No unsolicited refactoring.

## Clarification
- Ask if ambiguity affects correctness, architecture, risk, or implementation direction.
- Otherwise proceed with stated assumptions.

## Code
- Modify only explicitly requested files and sections.
- Show only changed code in responses. Use Edit tool for modifications.
- Likely-needed but unrequested changes: explain, don't apply.
- No new dependencies without justification.

## Test
- Test and implementation are separate tasks. Don't modify both together unless requested.
- If tests are missing/insufficient, explain the gap. Don't silently add.
- Verifier must not approve based on modified tests alone.

## Execution & Orchestration

### Defaults
- One user-facing reply per request. Internal agent orchestration is exempt.
- Step-by-step only when requested or task is stateful/destructive.

### Project-Level Flow (user-driven, phased)
1. analyze → 2. /plan-init → 3. /implement-init → 4. /implement → 5. verify
- Steps 2-3 are user-initiated commands. Steps 1, 4-5 use subagents.
- For independent features: /feature-init → /implement (with SPEC path) → verify
  - Entered only by explicit `/feature-init` invocation. Ad-hoc requests use Per-Request Orchestration.

### Per-Request Orchestration (automatic)
- Flow: [analyzer if triggered] → implementer → verifier
- Only main agent invokes subagents. Subagents never call subagents.
- If analyzer reports Blocker: stop, present to user. Do not proceed.
- On verifier reject: return issues to user. No auto-retry.
- On verifier approval: main agent updates PLAN.md / SPEC.md progress tracking per the verify skill.

### Analysis Trigger
Run analyzer if ANY:
- cause unknown
- non-trivial design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md.
- Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.
