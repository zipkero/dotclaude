---
description: Create or rewrite IMPLEMENT.md according to rules
---

> When to use: When PLAN.md exists and implementation strategy/order needs to be defined.
> Prerequisite: /plan-init

Create IMPLEMENT.md. This is an execution strategy document and the sole progress tracker during implementation.

Scope: $ARGUMENTS

## Role
- Define "how to implement."
- Execution strategy to satisfy PLAN.md Exit Criteria.
- Completion judgment uses PLAN.md. This document is the means.
- Current state and next task must be determinable from this document alone.

## Scope Handling
- Empty: cover the entire PLAN.md. Provided: matching PLAN items only. Ambiguous: interpret as narrowly as possible.

## Prerequisites
- Read PLAN.md first; use as baseline.
- Do not modify, weaken, or add to PLAN.md Exit Criteria.
- If PLAN.md does not exist, stop and request it first.

## Global Rules
- Every implementation unit maps to a specific PLAN.md Exit Criteria.
- Each unit includes "why this approach."
- No low-level coding details. Design choices go to Decision Points.

## Unit Size
- One verifiable behavioral boundary or PR-sized unit.
- Mixed Exit Criteria mappings → split. Pure file/function listing → merge.

## Unit Format
- Start with `- [ ]`. Write as behavioral structure units.

Required per unit:
- Purpose: which Exit Criteria + PLAN inline reference (`→ PLAN: Phase X > Task Y`)
- Design: structure (modules/interfaces/data flow), execution flow with branches

Optional (include when non-trivial):
- Responsibility: input / output / boundary (when boundaries are shared or ambiguous)
- Rationale: why this approach + trade-offs (when alternatives exist)
- Failure/Exception: possible failures and handling (when failure modes are non-obvious)

## Document Structure (top section)
- Architecture (required): components, boundaries, high-level flow
- Execution flow (required): input → output, major branches
- State model (only when stateful): types, storage, transition rules

## Ordering
- By dependency: "what must exist before the next is possible." One-line prerequisite per step.
- No chronological ordering.

## PLAN Mapping
- Every unit → Exit Criteria link. Remove unmapped units.
- PLAN items without mapping are marked as gaps using `<!-- gap: <reason> -->` inline comments.

## Progress Tracking
- Implementation done → check IMPLEMENT.md.
- Verification done → check PLAN.md.
- These are separate events. Do not conflate.

## Decision Point
- Options + trade-offs. Default suggestion allowed but no final decision. Keep separate from unit body.

## Prohibited
- Modifying/redefining PLAN Exit Criteria
- Concept-only explanations, unjustified structure choices, "implement first, fix later"
- Task-level decomposition, units that only list files/functions/classes

## Output
- Project root `IMPLEMENT.md`. If file exists, confirm before overwriting.

## Core Question
> What must be implemented, in what structure and order, to reach PLAN's done state?
> Where are we now, and what comes next?
