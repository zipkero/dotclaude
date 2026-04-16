# .claude

Personal configuration repository for Claude Code.

## Workflow

### Project Level (large tasks / initial design)

```
analyze → plan-init(PLAN.md) → implement-init(IMPLEMENT.md) → implement → verify
```

- **analyze**: Analyze codebase/problem. Stops flow on Blocker, escalates to user.
- **plan-init**: Create PLAN.md (completion checkpoint) based on analysis.
- **implement-init**: Create IMPLEMENT.md (execution strategy) based on PLAN.md.
- **implement**: Execute the next Unit from IMPLEMENT.md.
- **verify**: Independent verification against PLAN.md Exit Criteria + IMPLEMENT.md design intent.

### Feature Level (small tasks)

```
feature-init(SPEC.md) → analyze → implement → verify
```

- **feature-init**: Create a single SPEC.md combining Exit Criteria + implementation strategy.
- Subsequent skills receive the SPEC.md path via `$ARGUMENTS` and operate in feature mode.

> **Open**: Integration between feature-init and existing skill flow is under review. See "Open Questions" below.

## Structure

```
CLAUDE.md          # Global rules (Korean response, agent orchestration, etc.)
config.json        # Claude Code base settings
```

### agents/ — Custom subagent definitions

Run in separate contexts, bound to skills.

- `analyzer.md` — Analysis agent (analyze skill)
- `implementer.md` — Implementation agent (implement skill)
- `verifier.md` — Verification agent (verify skill)

**Separation of concerns**: Agent defines boundary rules (what NOT to do), Skill defines execution rules (HOW to do it).

### commands/ — Slash command definitions

- `plan-init.md` — Create PLAN.md (`/plan-init`)
- `implement-init.md` — Create IMPLEMENT.md (`/implement-init`)
- `feature-init.md` — Create feature SPEC.md (`/feature-init <feature-name>`)

### skills/ — Skill definitions

- `analyze` — Analysis, debugging, design decisions. Auto-triggered by Analysis Trigger conditions.
- `implement` — Execute implementation based on IMPLEMENT.md or SPEC.md.
- `verify` — Independent verification against Exit Criteria + design intent. Runs after every non-trivial implementation.

## Open Questions

### feature-init integration

Project level uses a 2-file system (PLAN.md / IMPLEMENT.md), feature level uses a 1-file system (SPEC.md).
Skills have SPEC.md branches in their Context Loading, but the following remain unresolved:

- **Entry point detection**: Must the SPEC.md path be explicitly passed via `$ARGUMENTS`, or can it be auto-detected?
- **analyze placement**: At project level, analyze runs first (before plan-init). At feature level, is it more natural for analyze to run after feature-init? Or should analyze come before feature-init?
- **Progress tracking**: SPEC.md §5 Progress Tracking merges the dual tracking of IMPLEMENT.md + PLAN.md into one. Is the implementation-done / verification-done distinction clear enough?
- **Scale boundary**: What defines "small"? At what point should the project-level flow be used instead of feature-init?

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
