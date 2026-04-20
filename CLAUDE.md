# Core Behavior

## Language & Tone
- Response language: Korean, casual but professional. Direct, fact-based.
- Document language: English for files inside `.claude/` (CLAUDE.md, skills, agents, commands, etc.). Korean for project artifacts (PLAN.md, SPEC.md, IMPLEMENT.md, etc.).

## Response
- Answer first. Explain when it improves correctness or decision-making.
- Include trade-offs/failure cases when they impact correctness, design decisions, or future risk.
- Stay in scope. No unsolicited refactoring.
- When the user's direction appears suboptimal based on evidence, state the disagreement and reasoning before proceeding. Do not silently comply with suspect direction.

## Clarification
- Ask if ambiguity affects correctness, architecture, risk, or implementation direction.
- Otherwise proceed with stated assumptions.

## Code
- Modify only explicitly requested files and sections, unless required for the requested change to remain correct (e.g., call sites of a changed signature).
- Show only changed code in responses. Use Edit tool for modifications.
- Likely-needed but unrequested changes: explain, don't apply.
- No new dependencies without justification.

## Test
- Test and implementation are separate tasks. Don't modify both together unless requested. Exception: a bug fix may include a regression test that reproduces the fixed bug. Feature additions still keep implementation and tests separate.
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
- `[analyze]` is the default entry for both flows. Skip only when no design decision is required and impact is clear.

**Automatic — Per-Request**
`prompt → [analyze if triggered] → implement → verify`
- Entered when the user sends a natural prompt with no slash command.
- Implementer states a brief approach note before execution (see implement skill).

### Orchestration Rules
- User invokes each slash command explicitly. Main agent never auto-chains commands.
- Only main agent invokes subagents (analyzer / implementer / verifier). Subagents never call subagents.
- Skills (`analyze` / `implement` / `verify`) are invoked through their corresponding subagent. Direct skill invocation is not part of the standard flow.
  - Exception: main may implement directly for trivial single-file edits with no design decision, new interface, or test changes. Main updates the IMPLEMENT.md Unit or SPEC.md §4 checkbox itself.
- On analyzer Blocker (types defined in `analyze` skill): stop and report for `infeasible` / `scope undefined`; relay the question to the user and resume for `needs input`. Never fabricate a workaround.
- On verifier reject: main agent reverts the implementation checkbox (`[x]` → `[ ]`) on IMPLEMENT.md Unit or SPEC.md §4 item, then returns issues to the user. No auto-retry.
- On verifier approval: main agent notifies the user.

### Analysis Trigger (Per-Request only)
Main agent auto-invokes analyzer if ANY condition below holds. In Phased flows, analyzer invocation is user-controlled — see Flows.
- cause unknown
- non-obvious design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md.
- Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.

## Extension
- If `EXTENSION.md` exists next to this file, read and follow it as additional instructions.
