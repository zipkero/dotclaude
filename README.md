# .claude

Personal configuration repository for Claude Code.

> Summary of rules lives in CLAUDE.md (authoritative source). This README describes structure and design intent.

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

### Project Level (large tasks / initial design)

```
analyze → /plan-init → /implement-init → /implement → verify
```

- Steps 1, 4-5 use subagents. Steps 2-3 are user-initiated commands.
- **analyze**: Analyze codebase/problem. Stops flow on Blocker, escalates to user.
- **/plan-init**: Create PLAN.md — defines "what must work" (Exit Criteria).
- **/implement-init**: Create IMPLEMENT.md — defines "how to implement" based on PLAN.md.
- **/implement**: Execute the next Unit from IMPLEMENT.md.
- **verify**: Independent verification against PLAN.md Exit Criteria + IMPLEMENT.md design intent.

### Feature Level (small, independent features)

```
/feature-init → /implement (SPEC path) → verify
```

- Entered only by explicit `/feature-init` invocation. Ad-hoc requests without `/feature-init` fall through to Per-Request Orchestration.
- **/feature-init**: Create SPEC.md combining Exit Criteria + implementation strategy.
- **/implement**: Receives SPEC.md path via `$ARGUMENTS`, operates in feature mode.
- **verify**: Uses SPEC.md §2 Exit Criteria as sole verification baseline (no PLAN.md needed).

### Per-Request (automatic, within a single request)

```
[analyzer if triggered] → implementer → verifier
```

- Triggered by Analysis Trigger conditions defined in CLAUDE.md (single source).
- On verifier reject: issues return to the user. No auto-retry.

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
