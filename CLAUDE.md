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
- One user-facing reply per user turn (a single prompt or slash command). Internal agent orchestration is exempt.
- Step-by-step only when the user explicitly requests it, or when the task is stateful/destructive.

### Flows

**User-driven — Project (Phased)**
`/analyze → /plan-init → /implement-init → /implement → /verify`

**User-driven — Feature (Phased)**
`prompt → /feature-init → /implement <SPEC path> → /verify`
- Feature-level typically begins with a natural prompt; the user then runs `/feature-init` to enter this flow.
- Analyzer is invoked only when the user explicitly calls `/analyze`.

**Automatic — Per-Request**
`prompt → [/analyze if triggered] → approach-summary → /implement → /verify`
- `approach-summary` = brief approach note from main agent before implementation. Not PLAN.md creation.
- Entered when the user sends a natural prompt with no slash command.

### Orchestration Rules
- User invokes each slash command explicitly. Main agent never auto-chains commands.
- Only main agent invokes subagents (analyzer / implementer / verifier). Subagents never call subagents.
- If analyzer reports Blocker: stop and report the Blocker reason to the user. Do not proceed.
- On verifier reject: return issues to the user. No auto-retry.
- On verifier approval: main agent updates PLAN.md / SPEC.md progress tracking (see verify skill).

### Analysis Trigger (automatic flow only)
In Per-Request Orchestration, run analyzer if ANY condition holds. In Phased flows, analyzer runs only when the user explicitly invokes `/analyze`.
- cause unknown
- non-trivial design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md.
- Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.
