---
description: >-
  Save the current architecture, design, or delivery context to a project-root CONTEXT.md with the goal, current state,
  confirmed decisions, unresolved questions, one next action, completion criteria, and links to the files to read next.
  Use when preparing a session handoff, pausing exploratory design work, or recording an unexpected design change in
  either Phased or Per-Request work.
---

## 역할
- 실행 주체는 main이며 subagent에 맡기지 않는다.
- 설계 또는 전달 작업의 현재 위치를 다음 세션이 대화 기록 없이 복원할 수 있게 프로젝트 루트 `CONTEXT.md`에 저장한다.
- `CONTEXT.md`는 활성 초점 하나의 현재 시점 상태이며 결정 이력이 아니다.
  초점이 바뀌면 교체한다.
- 이 command는 `CONTEXT.md`만 고친다.
  원본에 반영되지 않은 확정 사항은 `문서 반영 필요`에 적고, 원본 갱신은 `rules/feature-docs.md`가 정한 소유 주체가 한다.
- feature 산출물이나 지정된 진행 추적자가 있으면 Task 상태·요구사항·구현 계획은 그 문서가 기준이고, `CONTEXT.md`에는 작업을 멈춘 설계 변경, 현재 논점, 이어서 볼 파일과 다음 작업만 적는다.
  둘 다 없으면 사용자 요청 범위, 변경한 파일, 실행한 검증 결과를 기준으로 적는다.
- 프로젝트 루트는 파일을 만들기 전에 `commands/project-init.md` §대상 프로젝트 루트로 확인한다.

## 저장 절차
1. 기존 `CONTEXT.md`가 있으면 전체 읽는다.
2. 대화에서 사용자가 확정한 목표와 결정, 정해지지 않은 판단, 다음 작업을 추리고, 관련 문서·변경 파일·검증 결과(Git이면 branch와 기준 HEAD)로 실제 반영 여부와 경로를 확인한다.
3. 활성 인수인계(현재 목표·미확정 판단·다음 작업)와 문서 미반영 사항이 모두 없으면, `CLAUDE.md` §사전 확인에 따라 확인을 받고 기존 `CONTEXT.md`를 지운 뒤 마친다.
4. 기존 파일이 같은 주제면 현재 상태로 갱신하고, 명백히 다른 활성 주제면 덮어쓰기 전에 확인한다.
5. 현재 목표나 다음 작업 하나와 완료 기준을 근거 있게 정할 수 없으면 쓰기 전에 확인한다.

## CONTEXT.md 형식
`<…>`는 채울 자리다.

```markdown
# Context

저장: <yyyy-MM-dd HH:mm ±hh:mm>

## 현재 목표
<이번 작업이 도달하려는 결과와 요청 범위, 1~2문장>

## 현재 상태
<완료된 범위와 멈춘 지점>
- 마지막 검증: <실행한 검증과 결과, 또는 실행한 적 없음>
- 멈춤 원인: <해소되지 않은 원인과 해소 조건>
- Git: <현재 branch와 기준 HEAD>

## 현재 작업 문서
<활성 feature와 Task, 또는 진행 추적자(추적자라고 표시)와 현재 항목의 링크>

## 확정된 결정
- <사용자가 확정했고 다음 작업의 전제가 되는 결정 한 줄> — <근거 문서 위치 링크>

## 미확정 판단
- <논의됐지만 정해지지 않았고 다음 결과를 바꿀 쟁점> — <확인되는 문서 위치 링크>

## 다음 작업

- 작업: <새 세션이 바로 시작할 작업 하나>
- 완료 기준: <검증 가능한 기준>

## 먼저 읽을 파일
- <다음 작업에 필요한 원본 문서와 변경한 파일의 상대 링크. 변경한 파일은 표시>

## 문서 반영 필요
- <확정됐지만 원본·feature 산출물에 아직 반영되지 않은 내용>
```

- 적을 내용이 없는 항목은 `없음`으로 적고, 현재 상태 아래 덧붙임 줄은 해당 없으면 뺀다.
- 링크할 문서 자리가 없는 확정 결정은 `문서 반영 필요`에도 적고, 작업 문서가 없으면 변경한 파일을 `먼저 읽을 파일`에 적는다.
- 대화 전문·긴 요약·전체 변경 내용·로그와 명령 이력, 추정으로 채운 내용, 비밀값·인증 정보·개인정보는 넣지 않는다.

## 완료 보고
- 작성하거나 갱신한 `CONTEXT.md` 경로, 저장한 현재 목표와 다음 작업 한 문장씩, `문서 반영 필요` 항목을 알린다.
- `CONTEXT.md`를 지웠으면 그 사실과 근거를 알린다.
