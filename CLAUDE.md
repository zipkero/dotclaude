# Core Behavior

## Language & Tone
- Response: Korean, casual but professional. Direct, fact-based.
- Files in `.claude/`: rule and explanation text is English. Korean appears only inside template blocks that are copied verbatim into artifacts.
- Project artifacts under `docs/<feature-name>/` are Korean.

## Response
- Answer first. Explain when it improves correctness or decision-making.
- Include trade-offs/failure cases when they impact correctness, design, or future risk.
- Stay in scope. No unsolicited refactoring.
- When the user's direction appears suboptimal based on evidence, state the disagreement and reasoning before proceeding. Do not silently comply with suspect direction.

## Clarification
- Ask if ambiguity affects correctness, architecture, risk, or implementation direction. Otherwise proceed with stated assumptions.

## Code
- Modify only explicitly requested files and sections, unless required for the requested change to remain correct (e.g., call sites of a changed signature).
- Show only changed code in responses. Use Edit for modifications.
- Likely-needed but unrequested changes: explain, don't apply. No new dependencies without justification.

## Document Layout
Per-feature artifacts at `docs/<feature-name>/`:
- `spec.md` — requirements (what must exist)
- `analysis.md` — analysis + design (structure, data flow, interfaces, impact, risks, decisions)
- `implement.md` — execution checklist (Task 단위)
- `README.md` — feature-level summary, Status, history

`<feature-name>` is set at `/spec-init` and reused downstream. There is no `verify.md` — verify returns judgment to the conversation; main flips the implement.md checkbox per §Verify Handoff.

## Execution & Orchestration

### Defaults
- One user-facing reply per user turn. Internal orchestration is exempt.
- Step-by-step only when the user explicitly requests it, or when the task is stateful/destructive.

### Flows
- **Phased** (user-driven): `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`. Slash commands are user-invoked (no auto-chaining). `implement` and `verify` are natural-language triggers so the user controls phase advancement.
- **Per-Request** (automatic): `prompt → implement → verify`. Entered for a natural prompt with no slash command and no active `docs/<feature>/` scope. No documents generated.

The `analyze` skill is a cross-cutting investigation utility — not a phase. Main invokes it on demand per §Analysis Trigger below; the user may also invoke it directly at any time. It writes no files and is orthogonal to the flow sequences above.

### Orchestration Rules
- No subagents. Main invokes `analyze`, `implement`, and `verify` skills directly.
- On analyze skill Blocker: stop and report for `infeasible` / `scope undefined`; relay to user and resume for `needs input`. Never fabricate a workaround.
- Test ownership lives in the verify skill. Implement skill and implement-init command reference it rather than duplicating rules.

### Verify Handoff
Verify skill returns judgment only. Main is the sole writer of the implement.md checkbox (both directions).

- **Approved**: main flips the target implement.md checkbox `[ ]` → `[x]`. No other file changes. Notify user.
- **Rejected**:
  - If the target checkbox was `[ ]` (typical post-implement case), it stays `[ ]`.
  - If re-verifying a previously approved Task and the checkbox was `[x]`, main flips it back `[x]` → `[ ]`.
  - In either case, relay issues + reject reason to the user. No auto-retry. Next `implement` trigger resumes the same Task.

Per-Request mode: same protocol but no implement.md exists — result is conversation output only.

### Feature README Ownership
- Never modify the repo-root `/README.md`. Only the per-feature README (`docs/<feature-name>/README.md`) is touched by slash commands.
- Per-command Status flip rules live in each command file (`commands/spec-init.md`, `commands/analyze-init.md`, `commands/implement-init.md`).
- Feature completion is observable as "every implement.md Task `[x]`". Status carries no post-implementation flag.

### Revision & Rollback
- Requirements change → update spec.md, propagate only to affected sections of analysis.md → implement.md. Untouched sections stay as-is.
- Design change during implement → revise analysis.md first, then update affected implement.md items.
- Verify reject → fix the Task and re-run implement/verify. Checkbox remains `[ ]` until approval.
- Slash command overwrite semantics live in each command file's Overwrite Rule section.

### Analysis Trigger
The `analyze` skill is an on-demand investigation tool, not a phase. It writes no files — output lands in the conversation. Main auto-invokes it when any of the following holds:
- cause unknown
- non-obvious design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- concurrency or shared mutable state crossing a boundary
- production data / external API / auth path affected

Relationship to `/analyze-init`: the `analyze` skill is a utility (no file output); `/analyze-init` is the Phased design phase that writes `analysis.md`. A typical Phased pattern is to invoke `analyze` first to understand the problem, then run `/spec-init` → `/analyze-init` once scope is clear.

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md. Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.

## Extension
- If `EXTENSION.md` exists next to this file, read and follow it as additional instructions.
