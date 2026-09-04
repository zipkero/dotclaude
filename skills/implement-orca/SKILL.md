---
name: implement-orca
description: >-
  Run one implement -> verify cycle through Orca orchestration with two Codex workers - one for implement, a fresh one for verify.
  Covers a Phased Task from features/<feature-dir>/implement.md and Per-Request changes alike.
  User-invoked only; main stays the coordinator and owns every document update.
disable-model-invocation: true
---

대상: $ARGUMENTS

## 역할
implement → verify 한 바퀴를 Orca orchestration의 Codex 워커 두 벌로 돌린다.
구현·판단·기록 규칙을 새로 만들지 않는다 — 구현은 `skills/implement/SKILL.md`, 판단은 `skills/verify/SKILL.md`,
판단 이후 기록은 같은 파일 §verify 후처리를 그대로 따른다.
이 skill이 소유하는 것은 **워커 배치 순서와 워커 지시문 골격**뿐이다.

Orca 명령 표면(하위 명령·플래그·인자 이름)은 이 파일이 소유하지 않는다.
`skills/orchestration/SKILL.md`가 정한 방식으로 실행 파일을 고르고, 첫 워커를 띄우기 전에 그 binary의 버전에 맞는 가이드를 읽어 문법을 확인한다.
이 파일은 무엇을 하는지만 뜻으로 적으며, 명령을 여기서 짐작해 옮겨 적지 않는다.

## 실행 주체
main이 코디네이터다.
implementer·verifier agent는 쓰지 않는다 — 그 자리를 Codex 워커가 대신한다.
implement.md 체크박스와 feature README 갱신은 main이 한다 (`rules/feature-docs.md`).

흐름은 다섯 자리로 고정한다 — main → implement 워커 → main → verify 워커 → main.
워커끼리 직접 주고받지 않으며, 모든 전달은 main을 거친다.

## 전제 조건
- Orca 런타임이 떠 있어야 한다. 아니면 워커를 띄우지 않고 사용자에게 알린다.
- 현재 세션이 이미 다른 Dispatch의 워커면 중첩 깊이 제한에 걸려 워커를 띄울 수 없다. 멈추고 사유를 알린다.
- 모드 판정은 `skills/implement/SKILL.md` §컨텍스트 로딩이 소유한다.
  Phased면 feature-dir과 대상 `task-<nnn>`을, Per-Request면 워커에 넘길 요청 범위를 확정한다.
- Phased에서 대상 Task를 하나로 잡을 수 없으면 워커를 띄우기 전에 사용자에게 확인한다.
- 워커를 띄우기 전에 기준선을 기록한다 — 현재 HEAD와 commit되지 않은 변경 목록.
  implement가 만든 변경을 그 전부터 있던 변경과 가려내는 데 쓴다.

## 워커 배치
- 두 워커 모두 현재 worktree에 띄운다. verify의 기본 변경 범위가 commit되지 않은 working tree이기 때문이다.
- verify 워커는 implement 워커가 쓰던 터미널을 재사용하지 않고 새 세션으로 띄운다.
  같은 세션이 자기 구현을 판단하지 않게 하는 것이 목적이다.
- 두 워커 모두 codex로 띄운다.
- 한 번에 한 워커만 돈다. implement가 정착하기 전에 verify를 띄우지 않는다.
- 대기는 완료·에스컬레이션·질문을 기다리는 방식으로 하며, 기다리는 창이 빈 채로 닫히는 것은 실패가 아니다.
  구현 하나가 수십 분 걸릴 수 있으므로 창을 이어서 연다.
- 완료 보고를 받은 워커는 해제한다. 사용자가 살려두라고 한 경우만 예외이며, 그때는 살려둔다는 사실을 기록으로 남긴다.

## 워커 지시문 골격
두 워커의 지시문은 아래 뼈대를 공유한다. 바퀴마다 달라지는 것은 대상과 금지 파일 목록뿐이다.

1. **규칙 출처** — 워커는 Claude Code skill을 읽지 않으므로 따라야 할 파일을 절대경로로 풀어서 준다.
   implement 워커에는 `~/.claude/skills/implement/SKILL.md`, verify 워커에는 `~/.claude/skills/verify/SKILL.md`.
   두 워커 모두 `~/.claude/CLAUDE.md`와 다루는 언어에 해당하는 `~/.claude/rules/` 파일을 함께 읽는다.
   먼저 읽고 그 규칙대로 하라고 적는다.
2. **대상**
   - Phased: feature-dir 경로와 대상 `task-<nnn>`을 지목한다. spec.md·design.md·implement.md는 워커가 직접 읽는다.
     대상 Task는 main이 이미 확정했으므로 워커가 다시 고르게 두지 않는다.
   - Per-Request: 사용자 요청문을 그대로 인용한다.
   - verify 워커에는 검증할 변경 범위(implement가 고친 파일 목록)와 implement가 남긴 비고·한계 원문을 함께 싣는다.
3. **금지**
   - 공통 — feature 문서(spec.md·design.md·implement.md·feature README)를 고치지 않는다.
     진행 상태는 main이 소유한다 (`rules/feature-docs.md`).
   - 공통 — `~/.claude/` 아래 파일을 고치지 않는다.
   - 공통 — 이번 대상 범위 밖의 파일을 고치지 않는다.
     main이 손대면 안 되는 자리를 알고 있으면 경로로 열거해 함께 준다.
     기준은 "이 Task의 목적·검증 조건을 채우는 데 필요하지 않은데 뒤 Task나 다른 동작이 소유한 자리"다.
   - verify 워커 — 어떤 파일도 만들거나 고치지 않는다.
     근거를 모을 목적의 테스트 실행만 한다 (`skills/verify/SKILL.md` §테스트 evidence 규칙).
4. **질문 경로** — 막히면 스스로 정하지 말고 코디네이터에게 묻고 답을 기다린다.
5. **완료 보고** — 완료 보고를 정확히 한 번 보낸다.
   성공·실패를 명시 필드로 밝히고 고친 파일 목록을 함께 싣는다.
   본문에는 해당 skill의 §출력 구조를 그대로 담으며, verify 워커는 판정(`approved` / `rejected`)이 본문 첫 줄에 오게 한다.

## implement 워커 뒤 main
1. 완료 보고에서 결과·고친 파일 목록·본문을 받고 워커를 해제한다.
2. 고친 파일 목록을 기준선과 대조한다. 목록에 없는 변경이 있으면 verify 지시문의 변경 범위에 함께 싣는다.
3. 아래에 걸리면 verify 워커를 띄우지 않고 멈춰 사용자에게 올린다 (`skills/implement/SKILL.md` §완료).
   - 상태가 `blocked`인 경우
   - 접근 이탈을 "설계 변경이 필요함"으로 보고한 경우
   - 워커가 실패로 보고한 경우
4. 접근 이탈이 단순 구현 상세 차이이고 design.md·목적·검증 조건·참조를 바꿀 필요가 없을 때만,
   main이 implement.md의 그 Task 접근 필드를 실제 구현 방식으로 고친다.
5. verify 지시문을 조립해 새 워커를 띄운다.

## verify 워커 뒤 main
1. 판정을 받고 워커를 해제한다.
2. verify 워커가 파일을 고쳤는지 확인한다 — 고친 파일 목록이 비어 있어야 하고 작업 트리가 implement 직후와 같아야 한다.
   어긋나면 판정을 쓰지 않고 사용자에게 올린다.
3. `skills/verify/SKILL.md` §verify 후처리를 그대로 따른다.
   - Phased·`approved` — 체크박스를 전환하고, 조건에 걸리면 feature README와 루트 문서 낡음 보고까지 한다.
   - Phased·`rejected` — 체크박스를 그대로 두고 문제를 사용자에게 올린다.
   - Per-Request — 문서를 고치지 않고 결과만 보고한다.

## 재시도
이 skill은 한 바퀴만 돈다.
`rejected`를 자동으로 다시 구현하지 않으며, 다음 행동은 사용자가 정한다.
남은 Task를 사용자 개입 없이 이어서 도는 일은 `commands/implement-loop.md`가 소유한다.

## 금지
- 워커가 보낸 질문에 main이 대신 답하지 않는다. 사용자에게 올린다.
- 워커가 할 일을 main이 대신 구현하지 않는다. 고칠 게 남으면 다음 바퀴의 워커 몫이다.
- implement 워커와 verify 워커에 같은 터미널을 쓰지 않는다.
- 완료 보고가 아직 없다는 이유로 워커를 멈추거나 닫지 않는다.

## 보고
1. 진행 — implement·verify 워커의 결과를 한 줄씩.
2. 판정과 후처리 — 고친 문서가 있으면 무엇을 고쳤는지.
3. 다음 행동 — `rejected`이거나 중간에 멈췄으면 고쳐야 할 자리.
