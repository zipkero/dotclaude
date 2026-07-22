---
description: >-
  Save the current architecture, design, or delivery context to a project-root CONTEXT.md with the goal, current state,
  confirmed decisions, unresolved questions, one next action, completion criteria, and source-document links. Use when
  preparing a session handoff, pausing exploratory design work, or recording an unexpected design change during Phased
  spec, analysis, planning, or implementation work.
---

> 사용 시점: 세션 인수인계 준비, 탐색적 설계 작업의 중단, Phased 작업 중 예기치 않은 설계 변경의 기록.

# Context Save

## 목적

- 설계 또는 전달 작업의 현재 위치를 다음 세션이 대화 기록 없이 복원할 수 있게 저장한다.
- 프로젝트 루트의 `CONTEXT.md`만 인수인계 진입점으로 사용한다.
- 확정된 설계의 원문은 기존 프로젝트 문서에 두고 `CONTEXT.md`에는 현재 초점과 링크만 남긴다.

## 적용 경계

- main이 직접 처리하며 agent에 위임하지 않는다.
- Phased 문서가 있으면 Task 상태, 요구사항과 구현 계획은 해당 문서를 기준으로 유지한다.
- `CONTEXT.md`에는 Phased 작업을 중단시킨 설계 변경, 현재 논점, 이어서 볼 문서와 다음 작업만 기록한다.
- Phased 문서의 체크리스트나 전체 내용을 `CONTEXT.md`에 복제하지 않는다.
- 프로젝트 루트를 하나로 결정할 수 없으면 파일을 만들기 전에 사용자에게 대상 프로젝트를 확인한다.
- `/context-save`는 기본적으로 `CONTEXT.md`만 변경한다.
  확정된 결정을 원본 문서에도 반영해 달라는 요청이 없으면 다른 파일을 수정하지 않는다.
- Git branch, commit, status, diff는 조사하거나 `CONTEXT.md`에 기록하지 않는다.

## 저장 절차

1. 프로젝트 루트의 기존 `CONTEXT.md`가 있으면 전체를 읽는다.
2. 현재 대화에서 확인된 목표, 결정, 미확정 판단과 다음 작업을 추린다.
3. 관련 Phased 문서와 프로젝트 문서를 읽어 실제 반영 여부와 정확한 문서 경로를 확인한다.
4. 확인된 사실과 아직 결정하지 않은 내용을 분리한다.
5. 같은 설계 주제이면 기존 `CONTEXT.md`를 현재 상태로 갱신한다.
6. 기존 파일이 명백히 다른 활성 주제를 다루면 덮어쓰기 전에 사용자에게 확인한다.
7. 현재 목표나 하나의 다음 작업과 완료 기준을 근거 있게 확정할 수 없으면 작성 전에 사용자에게 확인한다.
8. 프로젝트 루트에 `CONTEXT.md`를 작성한다.

## CONTEXT.md 형식

```markdown
# Context

## 현재 목표

## 현재 상태

## 현재 작업 문서

## 확정된 결정

## 미확정 판단

## 다음 작업

- 작업:
- 완료 기준:

## 먼저 읽을 문서

## 문서 반영 필요
```

다음 기준으로 내용을 채운다.

- `현재 목표`는 이번 설계 작업이 도달하려는 결과를 1~2문장으로 적는다.
- `현재 상태`는 완료된 범위와 멈춘 지점을 적고 세부 작업 이력을 나열하지 않는다.
- `현재 작업 문서`에는 활성 feature와 Task가 있으면 그 문서와 Task를 링크하고, 없으면 `없음`으로 적는다.
- `확정된 결정`에는 사용자가 확정했거나 프로젝트 문서에서 확인한 내용만 적는다.
- `미확정 판단`에는 다음 결과를 실질적으로 바꿀 선택지만 적는다.
- `다음 작업`에는 새 세션이 바로 시작할 작업 하나와 검증 가능한 완료 기준을 적는다.
- `먼저 읽을 문서`에는 다음 작업에 필요한 원본 문서만 상대 링크로 적는다.
- `문서 반영 필요`에는 확정됐지만 원본 또는 Phased 문서에 아직 반영되지 않은 내용만 적고, 없으면 `없음`으로 적는다.

## 제외할 내용

- 대화 전문, 긴 요약, 전체 diff, 로그와 명령 실행 이력
- Git 상태와 커밋 정보
- 원본 문서의 긴 복사본
- 근거 없는 추정이나 선택하지 않은 대안을 확정된 결정처럼 표현한 내용
- 비밀값, 인증 정보, 개인정보

## 완료 보고

- 작성하거나 갱신한 `CONTEXT.md` 경로를 알린다.
- 저장한 현재 목표와 다음 작업을 한 문장씩 요약한다.
- 원본 문서에 반영되지 않은 확정 사항이 있으면 별도로 알린다.
