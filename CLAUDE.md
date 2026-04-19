# Core Behavior

## Language & Tone
- Response language: Korean, casual but professional. Direct, fact-based.
- Document language: English for files inside `.claude/` (CLAUDE.md, skills, agents, commands, etc.). Korean for project artifacts (PLAN.md, SPEC.md, IMPLEMENT.md, etc.).

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
`[analyze] → /plan-init → /implement-init → implement → verify`

**User-driven — Feature (Phased)**
`[analyze] → /feature-init → implement <SPEC path> → verify`
- Feature-level typically begins with a natural prompt; the user then runs `/feature-init` to enter this flow.
- `[analyze]` is the default entry for both flows. Skip only when the change is trivial (no design decision, no unclear impact).

**Automatic — Per-Request**
`prompt → [analyze if triggered] → implement → verify`
- Entered when the user sends a natural prompt with no slash command.
- Implementer states a brief approach note before execution (see implement skill).

### Orchestration Rules
- User invokes each slash command explicitly. Main agent never auto-chains commands.
- Only main agent invokes subagents (analyzer / implementer / verifier). Subagents never call subagents.
- Skills (`analyze` / `implement` / `verify`) are invoked through their corresponding subagent. Direct skill invocation is not part of the standard flow.
- If analyzer reports Blocker: stop and report the Blocker reason to the user. Do not proceed.
- On verifier reject: main agent reverts the implementation checkbox (`[x]` → `[ ]`) on IMPLEMENT.md Unit or SPEC.md §4 item, then returns issues to the user. No auto-retry.
- On verifier approval: main agent applies verification markers to PLAN.md / SPEC.md per verifier agent spec.

### Analysis Trigger (automatic flow only)
In Per-Request Orchestration, run analyzer if ANY condition holds. In Phased flows, analyzer runs only when the user explicitly requests analysis (analyze skill invocation or equivalent natural request such as "analyze this").
- cause unknown
- non-trivial design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md.
- Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.
