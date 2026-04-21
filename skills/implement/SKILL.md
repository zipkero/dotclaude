---
name: implement
description: "Execute the next item from docs/<feature-name>/implement.md. For Per-Request prompts without a feature directory, execute the requested change directly after a brief approach note."
---

## Context Loading
1. `$ARGUMENTS` matches `docs/<feature-name>/` or `docs/<feature-name>/implement.md` → Phased mode.
   - Read implement.md. If absent, stop and guide the user to run `/implement-init`.
   - Also read plan.md (design baseline) and spec.md (completion-criteria mapping).
   - If verify.md exists and its latest section is a failure, read that section first and prioritize the issues it cites.
   - Find the first incomplete item whose dependencies are met. Use its 목적 / 접근 / 검증 조건 fields as the execution baseline (artifact-language template labels).
2. `$ARGUMENTS` empty or otherwise → Per-Request mode.
   - No `docs/<feature>/` is created.
   - Self-check scope before execution (see Per-Request flow below).

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

If any of these looks necessary to satisfy the request, treat it as a scope signal — pause and suggest `/spec-init` rather than proceeding with silent expansion.

### Scope self-check
If any of the following holds, pause and suggest running `/spec-init` before proceeding:
- change touches ≥2 files with non-trivial coupling
- non-expansion baseline cannot be satisfied (new boundary/dependency/adjacent refactor unavoidable)
- involves a non-obvious design decision
- affects auth, external API, production data, or migrations

This check decides whether the change warrants structured documents (`/spec-init`). It is independent of CLAUDE.md Analysis Trigger, which decides whether main invokes analyzer. Signals overlap but the two answer different questions.

If the user overrides the suggestion, proceed without documents. Non-expansion baseline still applies unless the user explicitly waives a specific item.

## Output Structure
1. Approach
2. Code or logic
3. Key points
4. Notes or limitations (if any)

## Completion
- Phased mode: flip `[ ]` → `[x]` on the item in implement.md. No other document is modified by this skill.
- Per-Request mode: no document update.

## Test Handling (authoritative — implementer ownership)
- Test code and production code are separate concerns. Implementer writes test code **only** for implement.md items whose description explicitly designates them as test items. No other implicit test additions.
- Per-Request mode: never add tests silently. If the change carries meaningful regression risk (state change, external I/O, concurrency, new boundary), state the gap in the approach note and let the user decide whether to add tests in a follow-up.
- Bug-fix exception: a single regression test that reproduces the fixed bug may be included with the fix itself. Feature additions do not qualify for this exception.
- If existing tests appear missing or insufficient for the changed scope, state the gap in Notes. Do not silently add.

## Guidelines
- Keep implementation minimal and within scope.
- Follow existing conventions: match naming, structure, and error-handling patterns of existing files in the same directory.
  - If lint/format config exists, it takes precedence.
  - When uncertain, use the most recently modified file of the same type as reference.
- Explain briefly only when necessary.
