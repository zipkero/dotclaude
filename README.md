# .claude

Personal configuration repository for Claude Code.

> Authoritative rules live in CLAUDE.md. This README describes structure and design intent.

## Design Intent

### Why this structure exists
- Claude Code's default behavior is a single monolithic response. This config splits that into **phased, verifiable steps** so each stage can be reviewed before proceeding.
- The analyzer → implementer → verifier separation enforces **role isolation**: the agent that writes code never judges its own output.
- Documents (PLAN.md, IMPLEMENT.md, SPEC.md) serve as **contracts between phases** — not implementation notes. Each downstream phase reads the upstream document, not the conversation.

### Key design decisions
- **Agent = boundary, Skill = execution**: Agents define what NOT to do (prevent role leakage). Skills define HOW to do it (execution steps). This separation means agents stay stable while skills evolve.
- **Verifier reject escalates to user, no auto-retry**: Prompt-only orchestration cannot enforce retry counts deterministically, so rejects are surfaced to the user for judgment. The verify skill still classifies rejects (`style/minor`, `correctness`, `design/scope`) to help the user decide.
- **PLAN defines "done", IMPLEMENT defines "how"**: Completion is judged against PLAN.md Exit Criteria, not implementation progress. This prevents "all tasks checked but feature doesn't work" situations.
- **SPEC.md for features**: Combines PLAN + IMPLEMENT into one file for smaller scope. Avoids 2-file overhead when a single document is sufficient.

### What to preserve when modifying
- Role isolation between agents (analyzer never implements, verifier never modifies code)
- Evidence-based verification (verifier requires diff/test evidence, not reasoning alone)
- Phase contracts: downstream phases read documents, not conversation context
- The user controls phase transitions (commands are user-initiated, not auto-chained)

## Workflow

Three flows, authoritative in CLAUDE.md:

- **User-driven — Project**: `/analyze → /plan-init → /implement-init → /implement → /verify`
- **User-driven — Feature**: `prompt → /feature-init → /implement <SPEC path> → /verify`
- **Automatic — Per-Request**: `prompt → [analyzer if triggered] → plan → implementer → verifier`

`/analyze`, `/implement`, `/verify` are auto-exposed from skills in `skills/`; they are not defined as command files in `commands/`.

See CLAUDE.md → Execution & Orchestration and Context Resolution for trigger conditions, handoff, and reject handling.

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

- `plan-init.md` — Create PLAN.md (`/plan-init`)
- `implement-init.md` — Create IMPLEMENT.md (`/implement-init`)
- `feature-init.md` — Create feature SPEC.md (`/feature-init <feature-name>`)

### skills/ — Skill definitions

- `analyze` — Analysis, debugging, design decisions. Invocation conditions live in CLAUDE.md Analysis Trigger.
- `implement` — Execute implementation based on IMPLEMENT.md or SPEC.md.
- `verify` — Independent verification against Exit Criteria + design intent.

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
