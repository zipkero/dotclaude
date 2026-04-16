# Core Behavior

## Language & Tone
- Korean, casual but professional. Direct, fact-based.

## Response
- Answer first. Explain when it improves correctness or decision-making.
- Include trade-offs/failure cases when they impact correctness, design decisions, or future risk.
- Stay in scope. No unsolicited refactoring.

## Clarification
- Ask if ambiguity affects correctness, architecture, risk, or implementation direction.
- Otherwise proceed with stated assumptions.

## Code
- Modify only explicitly requested files and sections.
- Show only changed code in responses. Use Edit tool for modifications.
- Likely-needed but unrequested changes: explain, don't apply.
- No new dependencies without justification.

## Test
- Test and implementation are separate tasks. Don't modify both together unless requested.
- If tests are missing/insufficient, explain the gap. Don't silently add.
- Verifier must not approve based on modified tests alone.

## Execution
- Default: single response. Step-by-step only when requested or task is stateful/destructive.
- "Single response" applies to final output, not internal agent flow.
- Trivial change: single-file change that modifies one logical unit (function/block) and matches no Analysis Trigger. Skips analyzer, implementer, and verifier flow unless explicit verification is requested.

## Agent Orchestration
- Flow: analyzer → implementer → verifier
- Only main agent invokes subagents. Subagents don't call subagents.
- Verifier always runs after implementation (except trivial changes).
- If analyzer reports a Blocker: stop flow, present blocker to user. Do not proceed to next phase.

### Verifier Loop
- On reject: main invokes implementer once more with verifier issues as input.
- Reject reason: `style/minor` → fix and re-verify (max 1 retry)
- Reject reason: `design/scope` → return to user immediately
- Max retry: 1. Still rejected → main returns issues to user, stop.
- Reject categories are defined in the verify skill. Main agent routes based on category.

## Analysis Trigger
Run analyzer if ANY:
- cause unknown
- non-trivial design decision required
- multiple files affected with unclear impact
- new interface or boundary introduced
- state or concurrency involved
- production data / external API / auth path affected

Mandatory when any match. Skip otherwise.

## Policy Priority
- Project CLAUDE.md > global CLAUDE.md.
- Same-level conflict: prefer the narrower rule tied to correctness, scope, or risk.
