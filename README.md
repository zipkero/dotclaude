# .claude

Personal configuration repository for Claude Code.

> Authoritative rules live in CLAUDE.md. This README describes structure and design intent.

## Design Intent

### Why this structure exists
- Claude Code's default behavior is a single monolithic response. This config splits that into **phased, verifiable steps** so each stage can be reviewed before proceeding.
- The analyzer → implementer → verifier separation enforces **role isolation**: the agent that writes code never judges its own output.
- Documents (SPEC, PLAN.md, IMPLEMENT.md, feature doc) serve as **contracts between phases** — not implementation notes. Each downstream phase reads the upstream document, not the conversation.

### Key design decisions
- **Agent = boundary, Skill = execution**: Agents define what NOT to do (prevent role leakage). Skills define HOW to do it (execution steps). This separation means agents stay stable while skills evolve.
- **Verifier reject escalates to user, no auto-retry**: Prompt-only orchestration cannot enforce retry counts deterministically, so rejects are surfaced to the user for judgment. The verify skill still classifies rejects (`style/minor`, `correctness`, `design/scope`) to help the user decide.
- **SPEC is the upstream reference**: `/spec-init` produces a static SPEC document capturing requirements + behavioral feature definition. Both `/plan-init` and `/feature-init` consume SPEC as their input. SPEC carries no Exit Criteria, no design decisions, no implementation detail — those are derived by downstream documents.
- **PLAN holds completion criteria + design decisions; IMPLEMENT is a pure checklist**: Completion is judged against PLAN.md Exit Criteria (derived from SPEC §2 Feature Definition). All design/structure/order decisions live in PLAN Decision Points. IMPLEMENT.md tracks execution order and progress only — it never stands alone, always read with PLAN. Verification state is not persisted in either document; verify approval exists only in conversation output, and on reject the IMPLEMENT checkbox reverts to unchecked.
- **Feature doc for independent features only**: Combines Exit Criteria + Decision Points + checklist into one file for features outside PLAN's scope, derived from a SPEC. Not a tool for subdividing PLAN Phases — if the scope is covered by a PLAN Phase/Task, use IMPLEMENT.md instead.

### What to preserve when modifying
- Role isolation between agents (analyzer never implements, verifier never modifies code)
- Evidence-based verification (verifier requires diff/test evidence, not reasoning alone)
- Phase contracts: downstream phases read documents, not conversation context
- The user controls phase transitions (commands are user-initiated, not auto-chained)

## Workflow

Three flows, authoritative in CLAUDE.md:

- **User-driven — Project**: `[analyze] → /spec-init → /plan-init → /implement-init → implement → verify`
- **User-driven — Feature**: `[analyze] → /spec-init → /feature-init → implement <feature-doc path> → verify`
- **Automatic — Per-Request**: `prompt → [analyze if triggered] → implement → verify` (no docs generated)

`analyze`, `implement`, `verify` are skills in `skills/`, invoked through the corresponding subagents in `agents/`. They are not slash commands — the main agent routes the user's request to the subagent, which runs the skill. Direct skill invocation is not part of the standard flow. Narrow exception: main agent may implement directly when no design decision is required, the change is ≤ a few lines in one file, there is no new interface, and no test changes.

See CLAUDE.md → Execution & Orchestration for trigger conditions, handoff, and reject handling.

## Structure

```
CLAUDE.md          # Global rules (response language, orchestration, policy)
config.json        # Claude Code base settings
```

### agents/ — Custom subagent definitions

Run in separate contexts, bound to skills.

- `analyzer.md` — Analysis agent (analyze skill)
- `implementer.md` — Implementation agent (implement skill)
- `verifier.md` — Verification agent (verify skill)

### commands/ — Slash command definitions

- `spec-init.md` — Create SPEC at `spec/<yyyyMMdd>_<title>.md` (`/spec-init <title>`)
- `plan-init.md` — Create PLAN.md from SPEC (`/plan-init <spec-path>`)
- `implement-init.md` — Create IMPLEMENT.md (`/implement-init`)
- `feature-init.md` — Create feature doc at `features/<yyyyMMdd>_<title>.md` from SPEC (`/feature-init <spec-path>`)

### skills/ — Skill definitions

- `analyze` — Analysis, debugging, design decisions. Invocation conditions live in CLAUDE.md Analysis Trigger.
- `implement` — Execute implementation based on IMPLEMENT.md or a feature doc.
- `verify` — Independent verification against Exit Criteria + design intent.

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
