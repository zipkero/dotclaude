---
description: >-
  Save the current architecture, design, or delivery context to a project-root CONTEXT.md with the goal, current state,
  confirmed decisions, unresolved questions, one next action, completion criteria, and links to the files to read next.
  Use when preparing a session handoff, pausing exploratory design work, or recording an unexpected design change in
  either Phased or Per-Request work.
---

## 역할
- main이 지금 작업 위치를 프로젝트 루트(`commands/project-init.md` §대상 프로젝트 루트) `CONTEXT.md`에 저장해, 다음 세션이 대화 없이 이어갈 수 있게 한다.
- `CONTEXT.md`만 고치며, 작업 하나의 현재 상태만 담고 결정 이력은 쌓지 않는다.
- feature 문서가 있으면 Task 상태·요구사항은 옮기지 않고 링크한다.

## 저장 절차
1. 기존 `CONTEXT.md`를 읽고, 다른 주제면 덮어쓰기 전에 묻는다.
2. 각 항목 내용을 대화에서 고르고, 문서·변경 파일·검증 결과·Git 상태로 실제로 그런지 확인한다.
3. 돌고 있는 background 작업·worker가 있으면 기다리거나, 상태와 결과를 받을 곳을 `현재 상태`에 적는다.
4. 넘겨줄 것이 하나도 없으면 사용자 확인을 받고 `CONTEXT.md`를 지운다.

## CONTEXT.md 형식
```markdown
# Context

저장: <yyyy-MM-dd HH:mm ±hh:mm>

## 현재 목표
<목표와 요청 범위, 1~2문장>

## 현재 상태
<끝낸 것과 멈춘 지점>
- 마지막 검증: <검증과 결과>
- 멈춤 원인: <원인과 풀리는 조건>
- Git: <branch, 저장 시점 HEAD, 커밋 안 된 변경 파일>

## 현재 작업 문서
<활성 feature와 Task 링크>

## 확정된 결정
- <결정 한 줄> — <적힌 문서 위치>

## 작업 제약
- <사용자가 건 금지 사항, 범위 제한, 커밋·push 여부>

## 미확정 판단
- <정하지 못했고 결과를 바꿀 쟁점> — <확인할 위치>

## 시도했지만 실패한 접근
- <접근> — <실패 근거>

## 대기 중인 사용자 응답
- <답을 못 받은 질문, 그대로>

## 다음 작업
- 작업: <새 세션이 바로 시작할 일 하나>
- 완료 기준: <확인할 수 있는 기준>

## 먼저 읽을 파일
- <다음 작업에 필요한 문서와 변경한 파일 링크>

## 문서 반영 필요
- <확정됐지만 문서에 아직 없는 내용>
```
- 내용이 없는 항목은 `없음`으로 적는다.
- implement는 끝났고 verify 전에 멈췄으면 다음 작업은 그 Task의 verify이고, implement의 비고·접근 이탈을 `현재 상태`에 적는다.
- 대화 전문, 긴 로그, 추측, 비밀값·개인정보는 넣지 않는다.

완료하면 경로, 저장한 목표와 다음 작업, `문서 반영 필요` 항목을 알린다.
