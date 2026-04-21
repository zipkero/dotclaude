# .claude

Personal configuration repository for Claude Code.

> Authoritative rules live in CLAUDE.md. This README describes structure and design intent.

## Design Intent

### Why this structure exists
- Claude Code's default behavior is a single monolithic response. This config splits that into **phased, verifiable steps** so each stage can be reviewed before proceeding.
- The analyzer → implementer → verifier separation enforces **role isolation**: the agent that writes code never judges its own output.
- Per-feature documents under `docs/<feature-name>/` (spec → plan → implement → verify → README) serve as **contracts between phases** — not implementation notes. Each downstream phase reads the upstream document, not the conversation.

### Key design decisions
- **Agent = boundary, Skill = execution**: Agents define what NOT to do (prevent role leakage). Skills define HOW to do it (execution steps). This separation means agents stay stable while skills evolve.
- **Verifier reject escalates to user, no auto-retry**: Prompt-only orchestration cannot enforce retry counts deterministically, so rejects are surfaced to the user for judgment. The verify skill still classifies rejects (`style/minor`, `correctness`, `design/scope`) to help the user decide.
- **Per-feature folder**: Every feature owns a directory — `docs/<feature-name>/` — containing spec.md, plan.md, implement.md, verify.md, and README.md. README.md summarizes status and history; the four content docs carry the phase contracts.
- **SPEC owns completion criteria; PLAN is design-only**: spec.md captures requirement-level completion criteria (§5). plan.md carries structure, data flow, interfaces, impact, risks, and Decision Points — no checklists, no Exit Criteria duplication. implement.md maps each Unit back to spec.md §5 with narrower per-item Unit-level verification criteria.
- **verify.md is append-only history**: Each verify attempt appends one section (fail or pass) labeled with an attempt number. Failure attempts are never deleted — they are the risk record. Main agent (not verifier) writes verify.md based on the verifier's judgment.
- **Phased flow is user-controlled**: `/spec-init` → `/plan-init` → `/implement-init` are slash commands. `implement` and `verify` are natural-language triggers so the user decides when to advance.

### What to preserve when modifying
- Role isolation between agents (analyzer never implements, verifier never modifies any file)
- Evidence-based verification (verifier requires diff/test evidence, not reasoning alone)
- Phase contracts: downstream phases read documents, not conversation context
- User controls phase transitions (commands are user-initiated, not auto-chained)
- README.md Status checklist ownership is explicit per phase (see CLAUDE.md Orchestration Rules)

## Workflow

Two flows, authoritative in CLAUDE.md:

- **User-driven — Phased**: `prompt → [analyze if triggered] → /spec-init → /plan-init → /implement-init → implement → verify`
- **Automatic — Per-Request**: `prompt → [analyze if triggered] → implement → verify` (no docs generated)

`analyze`, `implement`, `verify` are skills in `skills/`, invoked through the corresponding subagents in `agents/`. They are not slash commands — the main agent routes the user's request to the subagent, which runs the skill. Direct skill invocation is not part of the standard flow. Narrow exception: main agent may implement directly when no design decision is required, the change is ≤ a few lines in one file, there is no new interface, and no test changes.

See CLAUDE.md → Execution & Orchestration for trigger conditions, handoff, and reject handling.

## Structure

```
CLAUDE.md          # Global rules (response language, orchestration, policy, doc layout)
config.json        # Claude Code base settings
```

### agents/ — Custom subagent definitions

Run in separate contexts, bound to skills.

- `analyzer.md` — Analysis agent (analyze skill)
- `implementer.md` — Implementation agent (implement skill)
- `verifier.md` — Verification agent (verify skill)

### commands/ — Slash command definitions

Each command writes under `docs/<feature-name>/` and updates `README.md` Status.

- `spec-init.md` — Create spec.md + initialize README.md (`/spec-init <feature-name>`)
- `plan-init.md` — Create plan.md from spec.md (`/plan-init <feature-name>`)
- `implement-init.md` — Create implement.md from plan.md (`/implement-init <feature-name>`)

### skills/ — Skill definitions

- `analyze` — Analysis, debugging, design decisions. Invocation conditions live in CLAUDE.md Analysis Trigger.
- `implement` — Execute next item from implement.md, or a Per-Request change with scope self-check.
- `verify` — Independent verification against spec.md §5 + implement.md Unit-level criteria. Returns judgment; main agent writes verify.md.

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
