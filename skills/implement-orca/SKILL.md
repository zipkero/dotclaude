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

`orchestration` skill의 가이드대로 감독 dispatch하며, full handoff가 아니다.
implement 완료 보고를 받은 뒤 verify를 새 Codex 워커에 맡기고, 터미널을 재사용하지 않는다.
워커는 `worker-start`에 `--agent codex --model gpt-6.1-sol --effort medium`을 붙여 만들고,
receipt의 `launch.effective`가 그 값과 같은지 확인한 뒤 dispatch한다.
다르거나 옵션이 거절되면 다른 모델·effort로 대체하지 않고 멈춰서 보고한다.
Task가 여럿이면 한 Task씩 끝내고 다음으로 간다.
reject 뒤 재시도와 정지는 대상 Task 수와 mode에 관계없이 `commands/implement-loop.md` §재시도·§정지 조건을 따른다.
verify 판정 뒤 기록은 main이 `skills/verify/SKILL.md` §verify 후처리대로 한다.
Per-Request는 워커가 이 대화를 받지 않으므로 범위를 문장으로 풀어 적는다.

TASK 본문에는 대상 `task-<nnn>`과 워커가 따를 skill(`~/.claude/skills/implement/SKILL.md` 또는 `~/.claude/skills/verify/SKILL.md`)을 지목하고, 그 skill의 §implementer 위임 기준·§verifier 위임 기준 항목과 기준선·직접 확인한 사실처럼 문서에 없는 것을 싣는다.
워커는 그 skill의 §출력 구조로 보고한다.
Orca preamble에 없는 아래 둘은 지시문에 직접 넣는다.
- commit하지 않고, `git checkout`·`restore`·`stash`·`reset`으로 파일을 되돌리지 않는다.
- verify 워커의 `--outcome`은 판정이 아니다.
  `rejected`도 판정을 마쳤으면 `succeeded`다.
