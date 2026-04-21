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
- `spec.md` — requirements
- `plan.md` — design
- `implement.md` — checklist + per-item verification criteria
- `verify.md` — append-only verification log
- `README.md` — summary, status, history

`<feature-name>` is set at `/spec-init` and reused downstream.

## Execution & Orchestration

### Defaults
- One user-facing reply per user turn. Internal agent orchestration is exempt.
- Step-by-step only when the user explicitly requests it, or when the task is stateful/destructive.

### Flows
- **Phased** (user-driven): `prompt → [analyze if triggered] → /spec-init → /plan-init → /implement-init → implement → verify`. Slash commands are user-invoked (no auto-chaining). `implement` and `verify` are natural-language triggers so the user controls phase advancement.
- **Per-Request** (automatic): `prompt → [analyze if triggered] → implement → verify`. Entered for a natural prompt with no slash command and no active `docs/<feature>/` scope. No documents generated; scope self-check lives in the implement skill.

### Orchestration Rules
- Main agent invokes the analyze and implement skills directly. Verifier runs as a subagent to preserve judgment independence; it is the only subagent.
- Test ownership lives in the implement and verify skills; CLAUDE.md delegates.
- On analyze Blocker: stop and report for `infeasible` / `scope undefined`; relay to user and resume for `needs input`. Never fabricate a workaround.

### Verify Handoff
Phased mode only. In Per-Request mode no documents exist — verifier returns judgment as conversation output and nothing else is written.

Verifier returns judgment only. Main agent performs all document updates. Section format (fields, headings) is defined in the verify skill; this section governs orchestration only.

On `rejected`:
1. Revert the affected implement.md checkbox (`[x]` → `[ ]`).
2. Append a failure section to verify.md (format per verify skill).
3. Unflip any stale `[x] IMPLEMENT` / `[x] VERIFY`.
4. Return issues to user. No auto-retry.

On `approved`:
1. Append a pass section to verify.md (format per verify skill). Prior failure sections preserved.
2. When approval covers remaining scope AND every implement.md item is `[x]`, flip `[x] VERIFY` and append `- <yyyy-MM-dd>: VERIFY 완료`.
3. Notify user.

### README.md Status Ownership
- `/spec-init`: create README.md, set `[x] SPEC`, append `- <yyyy-MM-dd>: SPEC 작성`.
- `/plan-init`: set `[x] PLAN`, append `- <yyyy-MM-dd>: PLAN 작성`.
- `/implement-init`: populate checklist only (do NOT touch `[ ] IMPLEMENT`), append `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`.
- Main agent flips `[x] IMPLEMENT` when the last implement.md item is checked, appending `- <yyyy-MM-dd>: IMPLEMENT 완료`. VERIFY: see Verify Handoff.
- Reconciliation: after any checkbox revert, main agent unflips `[x] IMPLEMENT` / `[x] VERIFY` if no longer valid. Status must reflect current state.

### Revision & Rollback
- Overwrite rule: slash commands overwrite by default. If any downstream document exists, warn and wait for explicit confirmation.
- Requirements change → update spec.md, propagate only to affected sections of plan.md → implement.md → verify.md. Untouched sections stay as-is.
- Design change during implement → revise plan.md first, then update affected implement.md items.
- Verify reject → fix implement.md items and re-run implement/verify. All verify.md attempt history is preserved.

### Analysis Trigger
Main agent runs the analyze skill when any of the following holds:
- cause unknown
- non-obvious design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

In Phased flow the user usually runs analyze explicitly before `/spec-init`; auto-trigger still applies when skipped. This trigger decides whether main runs analyze. A separate decision — whether to suggest `/spec-init` before executing a Per-Request change — lives in the implement skill's scope self-check. The two may fire on overlapping signals but answer different questions; neither subsumes the other.

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md. Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.

## Extension
- If `EXTENSION.md` exists next to this file, read and follow it as additional instructions.
