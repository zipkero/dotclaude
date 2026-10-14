---
description: >-
  Save the current architecture, design, or delivery context to a project-root CONTEXT.md with the goal, current state,
  confirmed decisions, unresolved questions, one next action, completion criteria, and links to the files to read next.
  Use when preparing a session handoff, pausing exploratory design work, or recording an unexpected design change in
  either Phased or Per-Request work.
---

## 역할
- main이 직접 한다.
- 다음 세션이 대화 기록 없이 이어갈 수 있게, 지금 작업 위치를 프로젝트 루트 `CONTEXT.md`에 저장한다.
- `CONTEXT.md`는 지금 집중하는 작업 하나의 현재 상태다.
  결정 이력을 쌓는 곳이 아니다.
- 이 command는 `CONTEXT.md`만 고친다.
- feature 문서가 있으면 Task 상태, 요구사항, 구현 계획은 옮겨 적지 않고 링크한다.
- feature 문서가 없으면 요청 범위, 변경한 파일, 검증 결과를 적는다.
- 프로젝트 루트는 `commands/project-init.md` §대상 프로젝트 루트로 찾는다.

## 저장 절차
1. 기존 `CONTEXT.md`가 있으면 전부 읽는다.
2. 대화에서 각 항목에 들어갈 내용을 고르고, 문서·변경 파일·검증 결과·Git 상태로 실제로 그런지 확인한다.
3. 돌고 있는 background agent·명령, Orca worker, `/loop`·예약 작업이 있으면 끝날 때까지 기다린다.
   안 끝나면 상태와 결과를 받을 곳을 `현재 상태`에 적는다.
4. 넘겨줄 것(목표, 미정 판단, 대기 중인 질문, 다음 작업)도, 문서에 반영 안 된 것도 없으면 기존 `CONTEXT.md`를 지우고 끝낸다.
   지우기 전에 CLAUDE.md §사전 확인대로 사용자에게 확인받는다.
5. 기존 파일이 같은 주제면 갱신한다.
   전혀 다른 작업이면 덮어쓰기 전에 묻는다.
6. 목표나 다음 작업 하나와 완료 기준을 근거 있게 정할 수 없으면 쓰기 전에 묻는다.

## CONTEXT.md 형식
`<…>`는 채울 자리다.

```markdown
# Context

저장: <yyyy-MM-dd HH:mm ±hh:mm>

## 현재 목표
<이번 작업의 목표와 요청 범위, 1~2문장>

## 현재 상태
<끝낸 것과 멈춘 지점>
- 마지막 검증: <실행한 검증과 결과, 또는 실행한 적 없음>
- 멈춤 원인: <풀리지 않은 원인과 풀리는 조건>
- Git: <현재 branch, 저장 시점 HEAD 커밋 해시, 커밋 안 된 변경 파일 목록 또는 없음>

## 현재 작업 문서
<활성 feature와 Task 링크>

## 확정된 결정
- <사용자가 정했고 다음 작업의 전제가 되는 결정 한 줄> — <그 결정이 적힌 문서 위치 링크>

## 작업 제약
- <사용자가 이번 작업에 건 지시: 금지 사항, 범위 제한, 커밋·push 여부 등>

## 미확정 판단
- <논의했지만 정하지 못했거나 확인하지 못했고, 다음 결과를 바꿀 쟁점·수치·동작> — <확인할 문서 위치 링크>

## 시도했지만 실패한 접근
- <해 봤는데 실패한 접근> — <실패 근거와 원인>

## 대기 중인 사용자 응답
- <사용자에게 물었는데 답을 못 받은 질문이나 승인 요청. 사용자가 다시 읽고 답할 수 있게 그대로>

## 다음 작업

- 작업: <새 세션이 바로 시작할 작업 하나>
- 완료 기준: <확인할 수 있는 기준>

## 먼저 읽을 파일
- <다음 작업에 필요한 원본 문서와 변경한 파일의 상대 링크. 변경한 파일은 표시>

## 문서 반영 필요
- <확정됐지만 원본·feature 문서에 아직 반영 안 된 내용>
```

- 쓸 내용이 없는 항목은 `없음`으로 적는다.
- `현재 상태` 아래 세부 줄은 해당 없으면 뺀다.
- 기계, OS, git 밖 설정처럼 환경에 묶인 상태는 호스트 이름이나 절대경로로 적는다.
- Phased에서 implement는 끝났고 verify 전에 멈췄으면, 다음 작업은 그 Task의 verify다.
  implement 보고의 비고·한계와 접근 이탈을 `현재 상태`에 적는다.
- 링크할 문서가 없는 확정 결정은 `문서 반영 필요`에도 적는다.
- 작업 문서가 없으면 변경한 파일을 `먼저 읽을 파일`에 적는다.
- 대화 전문, 긴 요약, 전체 diff, 로그, 명령 이력, 추측, 비밀값·인증 정보·개인정보는 넣지 않는다.

## 완료 보고
- `CONTEXT.md` 경로, 저장한 목표와 다음 작업 한 문장씩, `문서 반영 필요` 항목을 알린다.
- `CONTEXT.md`를 지웠으면 그 사실과 이유를 알린다.
