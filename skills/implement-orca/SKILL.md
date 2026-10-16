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

- `orchestration` skill대로 감독하며 dispatch하고(full handoff 아님), implement와 verify를 서로 다른 새 Codex 워커에 맡긴다.
- 워커는 `worker-start`에 `--agent codex --model gpt-6.1-sol --effort medium`으로 만들고, receipt의 `launch.effective`가 다르거나 옵션이 거절되면 다른 값으로 바꾸지 말고 멈춰서 알린다.
- Task가 여럿이면 하나씩 끝내고, Task 고르기·재시도·정지는 `commands/implement-loop.md` §루프 1·§재시도·§정지, verify 뒤 기록은 `skills/verify/SKILL.md` §verify 후처리를 따른다.
- TASK 본문에는 대상, 따를 skill 경로(`~/.claude/skills/implement/SKILL.md` 또는 `~/.claude/skills/verify/SKILL.md`), 그 skill의 위임 기준 항목, 문서에 없는 사실을 싣고, Per-Request는 범위를 문장으로 풀어 쓴다.
- TASK 본문에 "commit하지 않고 `git checkout`·`restore`·`stash`·`reset`으로 되돌리지 않는다"와 "verify의 `--outcome`은 판정이 아니므로 `rejected`여도 판정을 마쳤으면 `succeeded`다"를 직접 넣는다.
