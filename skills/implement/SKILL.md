---
name: implement
description: "Execute the next item from docs/<feature-name>/implement.md. For Per-Request prompts without a feature directory, execute the requested change directly after a brief approach note."
---

## Context Loading
1. Phased mode — enter when either:
   - `$ARGUMENTS` matches `docs/<feature-name>/` or `docs/<feature-name>/implement.md`, OR
   - The current conversation indicates an active `docs/<feature-name>/` scope (`/spec-init` / `/analyze-init` / `/implement-init` was run on that feature earlier in this conversation, or the user referenced it in the current turn).

   Actions:
   - Read implement.md. If absent, stop and guide the user to run `/implement-init`.
   - Also read analysis.md (design baseline) and spec.md (completion-criteria mapping).
   - Find the first incomplete item whose dependencies are met. Use its 목적 / 접근 / 검증 조건 fields as the execution baseline (artifact-language template labels).
2. Per-Request mode — otherwise (`$ARGUMENTS` empty **and** no active feature scope).
   - No `docs/<feature>/` is created.
   - Follow the Per-Request flow below.

## Per-Request flow
State a brief approach note (1-3 sentences) before execution, covering:
- scope and files touched
- risky points
- non-expansion line — what this change will NOT add (see baseline below)

### Non-expansion baseline
Unless the request explicitly asks for it, the implementation will not:
- introduce a new interface, abstraction, public API, or boundary
- add a new dependency or configuration surface
- refactor adjacent code beyond what is required for the requested change to remain correct

If any of these looks necessary to satisfy the request, state the expansion explicitly in the approach note before proceeding. Do not silently expand. Do not prompt the user to switch to `/spec-init` — the user chose Per-Request by not invoking it.

## Output Structure
1. Approach
2. Code or logic
3. Key points
4. Files touched — explicit list of paths modified. Serves as the diff scope for the next `verify` call, especially if the change is committed before verify runs.
5. Notes or limitations (if any)

## Completion
- Phased mode: do not modify the implement.md checkbox (checkbox flip is verify-gated — see CLAUDE.md §Verify Handoff). Return a brief summary identifying which Task was executed.
- Per-Request mode: no document update.

## Test Code Authoring
Test rules (when a Task counts as a test item, bug-fix exception, Per-Request handling, gap reporting) are owned by the verify skill — see `skills/verify/SKILL.md` §Test Rules. Do not duplicate those rules here.

Implement writes test code **only** for Tasks designated as test items per those rules.

## Guidelines
- Keep implementation minimal and within scope.
- Follow existing conventions: match naming, structure, and error-handling patterns of existing files in the same directory.
  - If lint/format config exists, it takes precedence.
  - When uncertain, use the most recently modified file of the same type as reference.
- Explain briefly only when necessary.
