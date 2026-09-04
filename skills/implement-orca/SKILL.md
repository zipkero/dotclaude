---
name: implement-orca
description: >-
  Dispatch both implement and verify to Codex workers through Orca orchestration - one worker for
  implement, a fresh one for verify - in place of the local implementer/verifier agents.
  Use only when the user explicitly asks for Codex workers or Orca dispatch.
  Covers a single Phased Task, a range of Tasks, and Per-Request changes alike.
argument-hint: "[구현·검증할 대상]"
---

대상: $ARGUMENTS

implementer·verifier agent를 쓰지 않는다 — 그 자리를 Codex 워커가 대신한다.
`orchestration` skill의 가이드대로 감독 dispatch하며, full handoff가 아니다.
implement 완료 보고를 받은 뒤 verify를 새 Codex 워커에 맡기고, 터미널을 재사용하지 않는다.
Task가 여럿이면 한 Task씩 끝내고 다음으로 간다.
Per-Request는 워커가 이 대화를 받지 않으므로 범위를 문장으로 풀어 적는다.

TASK 본문은 feature 문서에서 쓴다. 아래 둘만 Orca preamble이 안 실어 주니 직접 넣는다.
- commit하지 않고, `git checkout`·`restore`·`stash`·`reset`으로 파일을 되돌리지 않는다.
- verify 워커의 `--outcome`은 판정이 아니다. `rejected`도 판정을 마쳤으면 `succeeded`다.
