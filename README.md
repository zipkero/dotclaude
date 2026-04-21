# .claude

Personal configuration repository for Claude Code.

> Authoritative rules live in CLAUDE.md. This README describes structure and design intent.

## Design Intent

### Why this structure exists
- Claude Code's default behavior is a single monolithic response. This config splits that into **phased, verifiable steps** so each stage can be reviewed before proceeding.
- The verifier runs in an **independent context** as the only subagent — the point is judgment integrity, so the agent that writes code never judges its own output. analyze and implement run as skills on the main agent (no separate context needed; their boundaries are enforced by the skill prompts).
- Per-feature documents under `docs/<feature-name>/` (spec → plan → implement → verify → README) serve as **contracts between phases** — not implementation notes. Each downstream phase reads the upstream document, not the conversation.

### Key design decisions
- **Verifier is the only subagent**: independent context is a judgment-integrity requirement for verification. analyze and implement skills run on the main agent — their role boundaries live in the skill prompts, not in a separate agent layer.
- **Skills own execution, CLAUDE.md owns orchestration**: skill prompts describe HOW to run a phase. CLAUDE.md centralizes cross-phase rules (Verify Handoff, README Status Ownership, Revision & Rollback) so command and skill files reference rather than restate them.
- **Verifier reject escalates to user, no auto-retry**: Prompt-only orchestration cannot enforce retry counts deterministically, so rejects are surfaced to the user for judgment. The verify skill still classifies rejects (`style/minor`, `correctness`, `design/scope`) to help the user decide.
- **Per-feature folder**: Every feature owns a directory — `docs/<feature-name>/` — containing spec.md, plan.md, implement.md, verify.md, and README.md. README.md summarizes status and history; the four content docs carry the phase contracts.
- **SPEC owns completion criteria; PLAN is design-only**: spec.md captures requirement-level completion criteria (§5). plan.md carries structure, data flow, interfaces, impact, risks, and Decision Points — no checklists, no Exit Criteria duplication. implement.md maps each Unit back to spec.md §5 with narrower per-item Unit-level verification criteria.
- **verify.md is append-only history**: Each verify attempt appends one section (fail or pass) labeled with an attempt number. Failure attempts are never deleted — they are the risk record. Main agent (not verifier) writes verify.md based on the verifier's judgment.
- **Phased flow is user-controlled**: `/spec-init` → `/plan-init` → `/implement-init` are slash commands. `implement` and `verify` are natural-language triggers so the user decides when to advance.

### What to preserve when modifying
- Verifier's independence: verifier runs as a subagent and never modifies any file
- Evidence-based verification (verifier requires diff/test evidence, not reasoning alone)
- Phase contracts: downstream phases read documents, not conversation context
- User controls phase transitions (commands are user-initiated, not auto-chained)
- README.md Status checklist ownership is explicit per phase (see CLAUDE.md Orchestration Rules)

## Workflow

Two flows, authoritative in CLAUDE.md:

- **User-driven — Phased**: `prompt → [analyze if triggered] → /spec-init → /plan-init → /implement-init → implement → verify`
- **Automatic — Per-Request**: `prompt → [analyze if triggered] → implement → verify` (no docs generated)

`analyze` and `implement` are skills the main agent runs directly. `verify` runs as a subagent (see `agents/verifier.md`) so the judgment is formed in an independent context. None are slash commands.

See CLAUDE.md → Execution & Orchestration for trigger conditions, handoff, and reject handling.

## Structure

```
CLAUDE.md          # Global rules (response language, orchestration, policy, doc layout)
config.json        # Claude Code base settings
```

### agents/ — Custom subagent definitions

- `verifier.md` — Verification agent (verify skill). The only subagent; runs in an independent context to preserve judgment integrity.

### commands/ — Slash command definitions

Each command writes under `docs/<feature-name>/` and updates `README.md` Status.

- `spec-init.md` — Create spec.md + initialize README.md (`/spec-init <feature-name>`)
- `plan-init.md` — Create plan.md from spec.md (`/plan-init <feature-name>`)
- `implement-init.md` — Create implement.md from plan.md (`/implement-init <feature-name>`)

### skills/ — Skill definitions

- `analyze` — Analysis, debugging, design decisions. Run by main agent. Invocation conditions live in CLAUDE.md Analysis Trigger.
- `implement` — Execute next item from implement.md, or a Per-Request change with scope self-check. Run by main agent.
- `verify` — Independent verification against spec.md §5 + implement.md Unit-level criteria. Run via verifier subagent; returns judgment, main agent writes verify.md.

## Management

- `.gitignore` uses a whitelist approach for tracked files
- Session data, cache, credentials are excluded from tracking
