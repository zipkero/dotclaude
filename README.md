# .claude

Personal configuration repository for Claude Code.

> Authoritative rules live in CLAUDE.md. This README describes structure and design intent.

## Design Intent

### Why this structure exists
- Claude Code's default behavior is a single monolithic response. This config splits that into **phased, verifiable steps** so each stage can be reviewed before proceeding.
- Per-feature documents under `docs/<feature-name>/` (`spec.md` → `analysis.md` → `implement.md` + `README.md`) serve as **contracts between phases** — not implementation notes. Each downstream phase reads the upstream document, not the conversation.
- `implement` → `verify` → checkbox flip is a hard gate: a Task is recorded as done only after an explicit judgment pass against artifacts, not by forward momentum.

### Key design decisions
- **No subagents**: main invokes `analyze`, `implement`, and `verify` skills directly. Evidence discipline (judgment must cite files / diff / test results, not conversation memory) is enforced by the verify skill's prompt rules rather than by agent separation.
- **`analyze` skill is a utility, not a phase**: on-demand investigation tool that writes no files. Distinct from `/analyze-init`, which is the Phased design phase producing `analysis.md`. The skill may be invoked at any time in either flow; it is orthogonal to the phase sequence.
- **Verify reject escalates to user, no auto-retry**: prompt-only orchestration cannot enforce retry counts deterministically, so rejects surface to the user for judgment. The verify skill classifies rejects (`style/minor`, `correctness`, `design/scope`) to help decide next steps.
- **Per-feature folder**: `docs/<feature-name>/` holds `spec.md`, `analysis.md`, `implement.md`, and `README.md`. There is no `verify.md` — verify returns judgment to the conversation, and main is the sole writer of the `implement.md` checkbox (both directions — see CLAUDE.md §Verify Handoff).
- **SPEC owns completion criteria; ANALYSIS is design-only**: `spec.md` §5 holds requirement-level completion criteria. `analysis.md` carries structure, data flow, interfaces, impact, risks, and Decision Points — no checklists. `implement.md` maps each Task back to `spec.md` §5 with narrower Task-level verification criteria.
- **Phased flow is user-controlled**: `/spec-init` → `/analyze-init` → `/implement-init` are slash commands. `implement` and `verify` are natural-language triggers so the user decides when to advance.

### What to preserve when modifying
- Evidence discipline: verify cites files / diff / test results, not conversation reasoning.
- Judgment-only verify: no file writes from verify; main is the sole writer of the implement.md checkbox.
- Phase contracts: downstream phases read documents, not conversation context.
- User controls phase transitions (commands are user-initiated, not auto-chained).
- Feature README Status flip ownership is explicit per command (see each `commands/*-init.md`).

## Workflow

Two flows, authoritative in CLAUDE.md. Pick Phased when the work warrants a persistent trail (handoff, later reference, non-trivial scope); Per-Request otherwise.

- **Phased (user-driven, artifact-preserving)**: `prompt → /spec-init → /analyze-init → /implement-init → implement → verify`
- **Per-Request (automatic, no artifacts)**: `prompt → implement → verify`

The `analyze` skill is an on-demand investigation utility invokable from either flow; it is not part of the phase sequence. See CLAUDE.md §Analysis Trigger for conditions.

See CLAUDE.md §Execution & Orchestration for flow entry conditions, handoff, and reject handling.

## Structure

```
CLAUDE.md          # Authoritative rules (response language, orchestration, policy, doc layout)
config.json        # Claude Code base settings
```

### commands/ — Slash command definitions

Each command writes under `docs/<feature-name>/` and updates the feature `README.md` Status.

- `spec-init.md` — Create `spec.md` + initialize feature `README.md` (`/spec-init <feature-name>`)
- `analyze-init.md` — Create `analysis.md` from `spec.md` (`/analyze-init <feature-name>`)
- `implement-init.md` — Create `implement.md` from `analysis.md` (`/implement-init <feature-name>`)

### skills/ — Skill definitions

- `analyze` — On-demand investigation utility. Output to conversation only, no file writes. Invocation conditions live in CLAUDE.md §Analysis Trigger.
- `implement` — Execute the next Task from `implement.md` (Phased), or a Per-Request change without artifacts. Emits a **Files touched** list so the next `verify` call has an explicit diff scope.
- `verify` — Judge whether the most recent implement Task satisfies its DoD. Returns judgment to the conversation; main flips the `implement.md` checkbox per CLAUDE.md §Verify Handoff. Owns all test-related rules (when a test Task is required, when implement writes test code, what counts as valid test evidence) — see `skills/verify/SKILL.md` §Test Rules.

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
